import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dbUser:1234@cluster0.km502.mongodb.net/Road4Intern';
        
        // Remove deprecated options for newer mongoose versions
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
        return mongoose.connection;
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        throw err;
    }
};

export default connectDB;

