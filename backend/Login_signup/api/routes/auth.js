import express from 'express';
import { UserModel } from '../models/user.js';
import Joi from 'joi';
import bcrypt from 'bcryptjs'; // <-- changed from 'bcrypt'
import cors from 'cors';

const router = express.Router();
router.use(cors());

// Validation function
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
};

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if request body exists
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Validate request body
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0]?.message || "Error in validating login" });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // Compare password using bcryptjs
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // Generate auth token
        const token = user.generateAuthToken();
        res.status(200).json({ token, message: "Logged in successfully" });

    } catch (error) {
        console.error("Login error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        // Return more detailed error in development
        return res.status(500).json({ 
            message: "Internal Server Error in auth",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
