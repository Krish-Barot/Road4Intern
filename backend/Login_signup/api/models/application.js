import { model, Schema } from "mongoose";

const Application = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    jobId: {
        type: Schema.Types.ObjectId,
        ref: "internship", 
        required: true
    },

    originalname: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    destination: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
})

const ApplicationModel = model("application", Application)

export default ApplicationModel