import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    // If already connected, return existing connection
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log("Using existing MongoDB connection");
        return mongoose.connection;
    }

    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dbUser:1234@cluster0.km502.mongodb.net/Road4Intern';
        
        // Connect with options for serverless environments
        const db = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        
        isConnected = true;
        console.log("Connected to MongoDB");
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });
        
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected');
            isConnected = true;
        });
        
        return db.connection;
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        isConnected = false;
        // Don't throw - let individual requests handle connection failures
        return null;
    }
};

export default connectDB;

