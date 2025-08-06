import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import passwordcomplexity from 'joi-password-complexity';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id, name: this.name}, "secret-123", {expiresIn: '1h'})
    return token
}


const UserModel = mongoose.model('user', userSchema);

const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordcomplexity().required().label("Password")
    });

    return schema.validate(data)
}

export { UserModel, validate };