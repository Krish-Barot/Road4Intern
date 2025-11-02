import "./Jobs.css"
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from './config';

export default function Jobs({ user }) {
    const [company, setCompany] = useState('');
    const [locationInput, setLocationInput] = useState('');
    const [positionName, setpositionName] = useState('');
    const [jobData, setJobData] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false); 

    const navigate = useNavigate();
    const location = useLocation();

    async function Signup() {
        navigate("/signup");
    }

    async function Login() {
        navigate("/login");
    }

    function handleSubmit(e) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (company.trim()) params.append('company', company.trim());
        if (locationInput.trim()) params.append('location', locationInput.trim());
        if (positionName.trim()) params.append('positionName', positionName.trim());

        navigate(`/jobs?${params.toString()}`);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    async function fetchingData() {
        try {
        const endpoint = location.search
            ? `${API_ENDPOINTS.FILTERED_JOBS}${location.search}`
            : API_ENDPOINTS.JOBS_DATA;

            const response = await fetch(endpoint);
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
        }
    }

    useEffect(() => {
        fetchingData();
    }, [location.search]);

    return (
        <div className='homepages'>
            <div className="heading">
                <button 
                  className="hamburger" 
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  ☰
                </button>
                <h2 className='name'>Road4Intern</h2>

                <div className={`navbar ${menuOpen ? "open" : ""}`}>
                    <ul className='navUl'>
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
                    {!user ? (
                        <ul className='ul2'>
                            <li><button className='login' onClick={Login}>Login</button></li>
                            <li><button className='register' onClick={Signup}>Register</button></li>
                        </ul>
                    ) : (
                        <button className='logoutBtn' onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </div>

            {/* Jobs Section */}
            <div className='bodySection'>
                <h1 className='headLine'>Jobs</h1>
                <div className='searchBar'>
                    <form className='filter' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder='Company'
                            className='inputTag'
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                        />
                        <input
                            type='search'
                            placeholder='Select Location'
                            className='inputTag'
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                        />
                        <input
                            type='search'
                            placeholder='Select Job Title'
                            className='inputTag'
                            value={positionName}
                            onChange={(e) => setpositionName(e.target.value)}
                        />
                        <button className='searchButton' type='submit'>
                            <img src='/images/search.png' className='searchIcon' alt='' />Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="results">
                <h1 className="head">Jobs Listed</h1>
                {Array.isArray(jobData) && jobData.length > 0 ? jobData.map((job, i) => (
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

                            <button
                                className="jobDetailsbtn"
                                onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
                            >
                                Job Details
                            </button>
                        </div>
                    </div>
                )) : (
                    <p>No jobs found.</p>
                )}
            </div>
        </div>
    );
}
