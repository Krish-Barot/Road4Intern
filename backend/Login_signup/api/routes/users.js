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
        if (mongoose.connection.readyState !== 1) {
            // Try to reconnect if not connected
            try {
                await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dbUser:1234@cluster0.km502.mongodb.net/Road4Intern');
            } catch (connErr) {
                console.error('Failed to connect to DB:', connErr);
                return res.status(503).json({ message: 'Database connection error. Please try again.' });
            }
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