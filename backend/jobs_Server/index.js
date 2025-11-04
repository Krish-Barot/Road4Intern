import { ApifyClient } from "apify-client";
import connectDB from "../Login_signup/api/db.js";
import internship from '../Login_signup/api/models/internshipModel.js'
import express from 'express'
import cors from "cors";
import ApplicationModel from "../Login_signup/api/models/application.js";
import multer from "multer"
import { UserModel } from "../Login_signup/api/models/user.js";
import dotenv from "dotenv";
import Feedback from "../Login_signup/api/models/feedback.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const PORT = 3001
app.use(express.json())
 app.use(cors());

// connecting to DB
connectDB();

// Function to sync jobs from Apify (optional - can be called manually or via route)
async function syncJobsFromApify() {
    try {
        if (!process.env.token) {
            console.log("Apify token not found. Skipping job sync.");
            return;
        }

        const client = new ApifyClient({
            token: process.env.token
        });

        // Get the dataset
        const dataset = client.dataset('hJns9gAndkEPbwBYA');

        // Fetch results from the actor's dataset
        const { items } = await dataset.listItems();

        for (const item of items) {
            const { positionName, company, location, salary, description, isExpired, date_of_post } = item;

            try {
                // Check if job already exists
                const existing = await internship.findOne({ 
                    positionName, 
                    company, 
                    date_of_post 
                });
                
                if (!existing) {
                    const intern = new internship({ positionName, company, location, salary, description, isExpired, date_of_post })
                    await intern.save()
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        console.log("Jobs synced from Apify successfully");
    } catch (error) {
        console.error("Error syncing jobs from Apify:", error);
    }
}

// For job data

app.get('/data', async (req, res) => {
    try {
        const data = await internship.find().limit(30);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


// For jodetail using id
app.get('/jobdetails/:id', async (req, res) => {
    try {
        const data = await internship.findById(req.params.id);
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
})


// Data to application
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsPath = join(__dirname, '../../rfiapp/src/uploads/');
        return cb(null, uploadsPath)
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const upload = multer({ storage })

app.post('/application', upload.single('resume'), async (req, res) => {
    try {
        const { userId, jobId } = req.body;
        const { originalname, destination, filename, size } = req.file;
        const data = new ApplicationModel({ userId, jobId, originalname, destination, filename, size });
        await data.save()
        console.log(req.body)
        console.log(req.file)
        console.log("userId received:", userId);
        console.log("jobId received:", jobId);

        if (!userId || !jobId) {
            return res.status(400).json({ message: "userId and jobId are required" });
        }

        return res.status(201).json({ message: 'Resume uploaded successfully!' });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: "server error" });
    }
})

app.get('/application-history/:userId', async (req, res) => {
    try {
        const applications = await ApplicationModel.find({ userId: req.params.userId }).populate('jobId').sort({ date: -1 });
        res.json(applications);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch application history' });
    }
})

app.get('/filteredJobs', async (req, res) => {
    const { company, location, positionName } = req.query;

    const filter = {};
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (positionName) filter.positionName = { $regex: positionName, $options: 'i' };

    const jobs = await internship.find(filter);
    res.json(jobs);
});

app.get('/api/users/count', async (req, res) => {
    try {
        const count = await UserModel.countDocuments()
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to count users' });
    }
});

app.get('/api/company/count', async (req, res) => {
    try {
        const comp = await internship.aggregate([{ $group: { _id: "$company" } }])
        const count = comp.length
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to count users' });
    }
});

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


// Route to manually sync jobs (optional)
app.post('/sync-jobs', async (req, res) => {
    await syncJobsFromApify();
    res.json({ message: 'Job sync initiated' });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Optionally sync jobs on startup (commented out to avoid blocking)
    // await syncJobsFromApify();
});