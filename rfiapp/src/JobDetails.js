import './JobDetails.css'
import { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from './config';

export default function JobDetails({ user }) {
    const { id } = useParams();
    const [jobData, setJobData] = useState([])

    const navigate = useNavigate()

    async function Signup() {
        navigate("/signup")
    }

    async function Login() {
        navigate("/login")
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    async function fetchingData() {
        const response = await fetch(API_ENDPOINTS.JOB_DETAILS(id));
        const data = await response.json()
        setJobData(data)
    }
    useEffect(() => {
        fetchingData();
    }, [id]);

    if (!jobData) {
        return <div>Loading...</div>;
    }

    async function applyJob() {
        navigate('/application', { state: { jobId: jobData._id } })
    }


    return (
        <div className='landingPage'>
            <div className="heading">
                <div>
                    <h2 className='name'>Road4Intern</h2>
                </div>
                <div className='navigationBar'>
                    <ul className='navul'>
                        <li><Link to="/" className='navCompo'>Home</Link></li>
                        <li><Link to="/jobs" className='navCompo'>Jobs</Link></li>
                        <li><Link to="/application-history/:userId" className='navCompo'>Application History</Link></li>
                        <li><Link to="/about" className='navCompo'>About Us</Link></li>
                        <li><Link to="/contactUs" className='navCompo'>Contact Us</Link></li>
                    </ul>
                </div>
                <div className='signInUp'>
                    <div className='user-container'>
                        {user ? <p className='userName'>Welcome, {user.name || "User"}</p> : null}
                    </div>
                    <div className='registration'>

                    </div>
                    {!user ? (
                        <ul className='ul2'>
                            <li className='login'><button className='toLogIn' onClick={Login}>Login</button></li>
                            <li className='login'><button className='register' onClick={Signup}>Register</button></li>
                        </ul>
                    ) : (

                        <button className='logoutBtn' onClick={handleLogout}>Logout</button>
                    )}

                </div>
            </div>
            <div className='bodySec'>
                <h1 className='headLines'>Job Details</h1>
            </div>
            <div className='detail'>
                <h1>Details</h1>

                <div className="jobcard">
                    <h2 className="Title">{jobData.positionName}</h2>
                    <h3 className="company">{jobData.company}</h3>
                    <div className='card'>
                        <div className='description'>
                            {jobData.description}
                        </div>
                        <div className="info">
                            <p className="partition">
                                <img src="/images/duration.png" className="durationIcon" alt="" />
                                {jobData.isExpired === false ? "valid" : "expired"}
                            </p>
                            <p className="partition">
                                <img src="/images/salary.png" className="salaryIcon" alt="" />
                                {jobData.salary === null ? "TBD" : jobData.salary}
                            </p>
                            <p className="partition">
                                <img src="/images/location.png" className="locationIcon" alt="" />
                                {jobData.location}
                            </p>
                            <button className='apply' onClick={applyJob}>Apply Now</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}