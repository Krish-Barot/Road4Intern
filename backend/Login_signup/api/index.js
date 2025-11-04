import connectDB from "./db.js";
import express from 'express'
import cors from "cors";
import mongoose from 'mongoose';
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import dotenv from 'dotenv'
import internship from './models/internshipModel.js'
import ApplicationModel from './models/application.js'
import { UserModel } from './models/user.js'
import Feedback from './models/feedback.js'
import multer from "multer"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
app.use(express.json())
app.use(cors({
  origin: '*', // Allow all origins in production
  credentials: true
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// connecting to DB - start connection immediately
// In serverless, connection happens on first request, but we start it here
connectDB()
  .then(() => {
    console.log('Database connection ready');
  })
  .catch(err => {
    console.error('Database connection error at startup:', err.message);
    console.log(err);
    throw new Error('Database connection error at startup');
  });

// Auth routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)

// Jobs API routes
// Get all jobs
app.get('/data', async (req, res) => {
    try {
        const data = await internship.find().limit(100); // Limit to prevent timeout
        res.json(data);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: err.message 
        });
    }
});

// Get job details by ID
app.get('/jobdetails/:id', async (req, res) => {
    try {
        const data = await internship.findById(req.params.id);
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})

// Filtered jobs
app.get('/filteredJobs', async (req, res) => {
    const { company, location, positionName } = req.query;

    const filter = {};
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (positionName) filter.positionName = { $regex: positionName, $options: 'i' };

    const jobs = await internship.find(filter);
    res.json(jobs);
});

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // For Vercel, we'll use /tmp directory (writable in serverless functions)
        return cb(null, "/tmp")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const upload = multer({ storage })

// Application submission
app.post('/application', upload.single('resume'), async (req, res) => {
    try {
        const { userId, jobId } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const { originalname, destination, filename, size } = req.file;
        const data = new ApplicationModel({ userId, jobId, originalname, destination, filename, size });
        await data.save()
        
        if (!userId || !jobId) {
            return res.status(400).json({ message: "userId and jobId are required" });
        }

        return res.status(201).json({ message: 'Resume uploaded successfully!' });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: "server error" });
    }
})

// Application history
app.get('/application-history/:userId', async (req, res) => {
    try {
        const applications = await ApplicationModel.find({ userId: req.params.userId }).populate('jobId').sort({ date: -1 });
        res.json(applications);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch application history' });
    }
})

// User count
app.get('/api/users/count', async (req, res) => {
    try {
        const count = await UserModel.countDocuments()
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to count users' });
    }
});

// Company count
app.get('/api/company/count', async (req, res) => {
    try {
        const comp = await internship.aggregate([{ $group: { _id: "$company" } }])
        const count = comp.length
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to count companies' });
    }
});

// Contact Us
app.post("/contactUs", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const feedback = new Feedback({ name, email, message });
        await feedback.save();
        res.status(201).json({ success: true, msg: "Feedback submitted!" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error saving feedback", error });
    }
});

app.get("/health", (req, res) => res.json({ 
    status: "ok",
    dbConnected: mongoose.connection.readyState === 1,
    dbStatus: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
}));

app.get("/", (req, res) => res.send("Express on Vercel"));
app.get("/api", (req, res) => res.json({ 
    message: "API is working",
    dbConnected: mongoose.connection.readyState === 1,
    dbStatus: mongoose.connection.readyState,
    note: "DB status: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting",
    endpoints: {
        auth: "/api/auth",
        users: "/api/users",
        jobs: "/data",
        filteredJobs: "/filteredJobs"
    }
}));

// For local development
const PORT = process.env.PORT || 3002;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    });
}

// Export the app for Vercel serverless functions
export default app;