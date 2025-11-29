import { Link, useNavigate } from 'react-router-dom'
import './Homepage.css'
import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from './config';

export default function Homepage({ user }) {
    const [job, setJob] = useState([])
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [positionName, setpositionName] = useState('');
    const [candidate, setCandidate] = useState(0)
    const [countCompanies, setcountCompanies] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate()

    async function Signup() {
        navigate("/signup")
    }

    async function Login() {
        navigate("/login")
    }


    function handleSubmit(e) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (company.trim()) params.append('company', company.trim());
        if (location.trim()) params.append('location', location.trim());
        if (positionName.trim()) params.append('positionName', positionName.trim());

        navigate(`/jobs?${params.toString()}`);
    }


    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    async function fetchCounts() {
        try {
            setLoading(true);
            // Fetch all counts in parallel for better performance
            const [usersRes, companiesRes, jobsRes] = await Promise.allSettled([
                fetch(API_ENDPOINTS.USERS_COUNT),
                fetch(API_ENDPOINTS.COMPANY_COUNT),
                fetch(API_ENDPOINTS.JOBS_DATA)
            ]);

            // Handle users count
            if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
                const usersData = await usersRes.value.json();
                setCandidate(usersData.count || 0);
            } else {
                console.error('Failed to fetch users count:', usersRes.reason);
                setCandidate(0);
            }

            // Handle companies count
            if (companiesRes.status === 'fulfilled' && companiesRes.value.ok) {
                const companiesData = await companiesRes.value.json();
                setcountCompanies(companiesData.count || 0);
            } else {
                console.error('Failed to fetch companies count:', companiesRes.reason);
                setcountCompanies(0);
            }

            // Handle jobs count (from jobs data)
            if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
                const jobsData = await jobsRes.value.json();
                const jobsArray = Array.isArray(jobsData) ? jobsData : (jobsData.data || []);
                setJob(jobsArray);
            } else {
                console.error('Failed to fetch jobs:', jobsRes.reason);
            }
        } catch (error) {
            console.error('Error fetching counts:', error);
            setCandidate(0);
            setcountCompanies(0);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCounts();
    }, [])

    return (
        <div className='homepage'>
            <div className="header">
                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                <div>
                    <h2 className='name'>Road4Intern</h2>
                </div>

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
            <div className='bodySection'>
                <h1 className='headLine'>Find Your Dream Internship Today!</h1>
                <p className='tagLine'>Connecting Talent with Opportunity: Your Gateway to Career Success</p>
            </div>
            <div className='searchBar' onSubmit={handleSubmit}>
                <form className='filter'>
                    <input type="text" placeholder='Company' className='inputTag' value={company} onChange={(e) => setCompany(e.target.value)} />
                    <input type='search' placeholder='Select Location' className='inputTag' value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input type='search' placeholder='Select Job Title' className='inputTag' value={positionName} onChange={(e) => setpositionName(e.target.value)} />
                    <button className='searchButton' type='submit'><img src='/images/search.png' className='searchIcon' alt='' />Search</button>
                </form>
            </div>
            <div className='data'>
                <div className='container1'>
                    <p className='jobData'><img src='/images/jobIcon.png' className='jobIcon' alt='' /></p>
                    <div className='datas'>
                        <p className='number'>{Array.isArray(job) ? job.length : 0}</p>
                        <p className='designation'>Jobs</p>
                    </div>
                </div>
                <div className='container1'>
                    <p className='jobData'><img src='/images/candidateIcon.png' className='candidateIcon' alt='' /></p>
                    <div className='datas'>
                        <p className='number'>{candidate}</p>
                        <p className='designation'>Candidates</p>
                    </div>
                </div>
                <div className='container1'>
                    <p className='jobData'><img src='/images/companyIcon.png' className='companyIcon' alt='' /></p>
                    <div className='datas'>
                        <p className='number'>{countCompanies}</p>
                        <p className='designation'>Companies</p>
                    </div>
                </div>
            </div>
            
        </div>

    )
}