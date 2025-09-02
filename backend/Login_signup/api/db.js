import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connect('mongodb+srv://dbUser:1234@cluster0.km502.mongodb.net/Road4Intern', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err))
}


export default connectDB;

