import { Schema, model } from "mongoose"

const internshipSchema = new Schema ({
    positionName: {
        type: String,
        require: true
    },
    company: {
        type: String,
        require: true
    },
    location:{
        type: String,
        require: true
    },
    salary: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    isExpired: {
        type: Boolean
    },

    date_of_post: {
        type: Date
    }
})

const internshipModel = model("internship", internshipSchema)

export default internshipModel