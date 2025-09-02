import './ApplicationHistory.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ApplicationHistory({ user }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            try {
                const res = await fetch(`http://134.122.35.63:5001/application-history/${user._id}`);
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
        <div className='application-history-page'>
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
                        <li><Link to="/" className='navCompo' onClick={() => setMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/jobs" className='navCompo' onClick={() => setMenuOpen(false)}>Jobs</Link></li>
                        <li><Link to={`/application-history/${user?._id}`} className='navCompo' onClick={() => setMenuOpen(false)}>Application History</Link></li>
                        <li><Link to="/about" className='navCompo' onClick={() => setMenuOpen(false)}>About Us</Link></li>
                        <li><Link to="/contactUs" className='navCompo' onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
                    </ul>
                </div>

                <div className='signInUp'>
                    <div className='user-container'>
                        {user ? <p className='userName'>Welcome, {user.name || "User"}</p> : null}
                    </div>
                    <div className='registration'></div>
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

            <div className="history-container">
                <h2>Application History</h2>
                {loading ? (
                    <p className="loading">Loading application history...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : applications.length > 0 ? (
                    <div className="applications-list">
                        {applications.map((app, idx) => (
                            <div key={idx} className="application-card">
                                <h3>{app.jobId?.positionName || "Unknown Position"}</h3>
                                <p className="company"><em>{app.jobId?.company || "Unknown Company"}</em></p>
                                <p className="application-date">Applied on: {app.date ? new Date(app.date).toLocaleDateString() : "Date not available"}</p>
                                <div className="status-badge">{app.status || "Applied"}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-applications">
                        <p>You have not applied to any jobs yet.</p>
                        <button className="browse-jobs-btn" onClick={() => navigate("/jobs")}>
                            Browse Available Jobs
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}