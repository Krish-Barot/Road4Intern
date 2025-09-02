import express from 'express';
import { UserModel } from '../models/user.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import cors from 'cors'


const router = express.Router();
router.use(cors());
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    })
    return schema.validate(data);
}

router.post("/", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await UserModel.findOne({ email: email })

        const { error } = validate(req.body)
        if (error) {
            return res.status(400).send({ message: "Error in validating in login" })
        }


        if (!user) {
            return res.status(401).send({ message: "Invalid Email or Password" })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(401).send({ message: "Invalid Email or Password" })
        }
        const token = user.generateAuthToken();

        res.status(200).send({ token, message: "Logged in successfully" })

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({ message: "Internal Server Error in auth !!!" })
    }


})

export default router;