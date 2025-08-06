import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connect('mongodb://localhost:27017/Road4Intern', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err))
}


export default connectDB;

