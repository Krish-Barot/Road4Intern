import mongoose from 'mongoose';

// Global connection state
let cachedConnection = null;

const connectDB = async () => {
    // If already connected, return cached connection
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // If already trying to connect, wait for that connection
    if (mongoose.connection.readyState === 2) {
        // Wait up to 10 seconds for existing connection
        for (let i = 0; i < 100; i++) {
            if (mongoose.connection.readyState === 1) {
                cachedConnection = mongoose.connection;
                return mongoose.connection;
            }
            if (mongoose.connection.readyState === 0) {
                // Connection failed, break and try again
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dbUser:1234@cluster0.km502.mongodb.net/Road4Intern';
        
        // Set connection options optimized for serverless
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxPoolSize: 1,
            minPoolSize: 0,
            bufferCommands: false,
        };
        

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoURI, options);
        
        // Verify connection is actually ready
        if (mongoose.connection.readyState === 1) {
            cachedConnection = mongoose.connection;
            console.log("✅ Connected to MongoDB successfully");
            return mongoose.connection;
        } else {
            console.log(err);   
            throw new Error(`Connection state is ${mongoose.connection.readyState}, expected 1`);
        }
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        cachedConnection = null;
        
        // Reset connection state if it's stuck
        if (mongoose.connection.readyState === 2) {
            try {
                await mongoose.disconnect();
            } catch (e) {
                // Ignore disconnect errors
            }
        }
        
        throw error;
    }
};

export default connectDB;

