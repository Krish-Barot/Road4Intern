import express from 'express';
import mongoose from 'mongoose';
import { validate, UserModel } from '../models/user.js';
import bcrypt from 'bcryptjs';
import cors from 'cors';


const router = express.Router();
router.use(cors());

router.post("/", async (req, res) => {
    try {
        // Ensure DB is connected before querying
        let dbConnected = false;
        try {
            const connectDB = (await import('../db.js')).default;
            await connectDB();
            // Wait for connection to be ready
            if (mongoose.connection.readyState === 1) {
                dbConnected = true;
            } else {
                // Wait up to 3 seconds for connection
                for (let i = 0; i < 30; i++) {
                    if (mongoose.connection.readyState === 1) {
                        dbConnected = true;
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        } catch (connErr) {
            console.error('Database connection failed in signup route:', connErr.message);
            return res.status(503).json({ 
                message: 'Database connection error. Please try again.',
                error: connErr.message 
            });
        }

        if (!dbConnected) {
            return res.status(503).json({ 
                message: 'Database connection timeout. Please try again.',
                status: mongoose.connection.readyState 
            });
        }

        const {error} = validate(req.body);

        if(error){
            console.log(error.details)
            return res.status(400).json({message: error.details[0]?.message || "Error in validating"})
        }

        const user = await UserModel.findOne({email: req.body.email})
        if(user){
            return res.status(409).json({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT || 10))
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new UserModel({...req.body, password:hashPassword}).save()
        res.status(201).json({message: "User created successfully!!"})
    } catch (error) {
        console.error("Signup error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            message: "Internal server error in users",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
})

export default router;