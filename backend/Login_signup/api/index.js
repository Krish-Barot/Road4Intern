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

const PORT = 3000


// app.listen(PORT, () =>{
//     console.log(`Server running on ${PORT}`)
// })