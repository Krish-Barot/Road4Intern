import connectDB from "./db.js";
import express from 'express'
import cors from "cors";
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import dotenv from 'dotenv'
dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());

// connecting to DB
connectDB();

// routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => res.send("Express on Vercel"));
app.get("/api", (req, res) => res.send("API is working"));

// For local development
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    });
}

// Export the app for Vercel serverless functions
export default app;