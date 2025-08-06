import './ApplicationHistory.css'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

export default function ApplicationHistory({ user }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/application-history/${user._id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                console.log("Applications fetched:", data);
                setApplications(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Error loading application history.");
            } finally {
                setLoading(false);
            }
        }

        if (user && user._id) fetchHistory();
    }, [user]);

    if (loading) return <p>Loading application history...</p>;
    if (error) return <p>{error}</p>;
    if (applications.length === 0) return <p>No applications found.</p>;

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

    return (
        <div className='homepage'>
            <div className="header">
                <div>
                    <h2 className='name'>Road4Intern</h2>
                </div>
                <div className='navbar'>
                    <ul className='navUl'>
                        <li><Link to="/" className='navCompo'>Home</Link></li>
                        <li><Link to="/jobs" className='navCompo'>Jobs</Link></li>
                        <li><Link to="/application-history/:userId" className='navCompo'>Application History</Link></li>
                        <li><Link to="/about" className='navCompo'>About Us</Link></li>
                        <li><Link to="/contact" className='navCompo'>Contact Us</Link></li>
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
                <div className="history">
                    <h2>Application History</h2>
                    <ul>
                        {applications.map((app, idx) => (
                            <li key={idx}>
                                <strong>{app.jobId?.positionName || "Unknown Position"}</strong> at <em>{app.jobId?.company || "Unknown Company"}</em>
                                <p>Applied on: {app.date ? new Date(app.date).toLocaleDateString() : "Date not available"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
            );
}
