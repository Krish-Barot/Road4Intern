import express from 'express';
import { validate, UserModel } from '../../models/user.js';
import bcrypt from 'bcrypt';
import cors from 'cors';


const router = express.Router();
router.use(cors());

router.post("/", async (req, res) => {
    try {
        const {error} = validate(req.body);

        if(error){
            console.log(error.details)
            return res.status(400).send({message: "Error in validating"})
        }

        const user = await UserModel.findOne({email: req.body.email})
        if(user){
            return res.status(409).send({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT || 10))
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new UserModel({...req.body, password:hashPassword}).save()
        res.status(201).send({message: "User created successfully!!"})
    } catch (error) {
        console.log(error)
        res.status(500).send({message: "Internal server error in users !!"})
    }
})

export default router;