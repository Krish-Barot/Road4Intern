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

        // Validate request body
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: "Error in validating login" });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        // Compare password using bcryptjs
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        // Generate auth token
        const token = user.generateAuthToken();
        res.status(200).send({ token, message: "Logged in successfully" });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({ message: "Internal Server Error in auth !!!" });
    }
});

export default router;
