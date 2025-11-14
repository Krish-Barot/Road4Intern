import "./RecentJobs.css"
import { useEffect } from "react";
import { useState } from "react";
import { API_ENDPOINTS } from './config';

export default function RecentJobs() {

    const [jobData, setJobData] = useState([])
    const [loading, setLoading] = useState(true)
    
    async function fetchingData() {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.JOBS_DATA, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Handle different response formats
            let jobs = [];
            if (Array.isArray(data)) {
                jobs = data;
            } else if (data && Array.isArray(data.data)) {
                jobs = data.data;
            } else if (data && data.success && Array.isArray(data.data)) {
                jobs = data.data;
            }
            
            setJobData(jobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setJobData([]);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchingData();
    }, []);

    return (
        <div className="jobcard1">
            <h1>Recents Jobs Available</h1>
            <hr></hr>
            {loading ? (
                <p>Loading jobs...</p>
            ) : Array.isArray(jobData) && jobData.length > 0 ? jobData.slice(0, 5).map((job, i) => (
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
            {(!Array.isArray(jobData) || jobData.length === 0) && (
                <p>No jobs available at the moment.</p>
            )}

        </div>
        //  scp build root@134.122.35.63:/root/
    )

}
