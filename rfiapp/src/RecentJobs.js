import "./RecentJobs.css"
import { useEffect } from "react";
import { useState } from "react";

export default function RecentJobs() {

    const [jobData, setJobData] = useState([])
    async function fetchingData() {
        const response = await fetch("http://localhost:3001/data");
        const data = await response.json()
        setJobData(data)
    }
    useEffect(() => {
        fetchingData();
    }, []);

    return (
        <div className="jobcard1">
            <h1>Recents Jobs Available</h1>
            <hr></hr>
            {jobData.slice(0, 5).map((job, i) => (
                <div key={i} className="jobcard2">
                    <h2 className="title">{job.positionName}</h2>
                    <h3 className="company">{job.company}</h3>
                    <div className="about">
                        <p className="column">
                            <img src="/images/duration.png" className="durationIcon" alt="" />
                            {job.isExpired === false ? "valid" : "expired"}
                        </p>
                        <p className="column">
                            <img src="/images/salary.png" className="salaryIcon" alt="" />
                            {job.salary === null ? "TBD" : job.salary}
                        </p>
                        <p className="column">
                            <img src="/images/location.png" className="locationIcon" alt="" />
                            {job.location}
                        </p>

                        <button className="jobDetailsbtn" onClick={() => window.open(`/jobs/${job._id}`, '_blank')}>Job Details</button>
                    </div>
                </div>
            ))}

        </div>
        //  scp build root@134.122.35.63:/root/
    )

}
