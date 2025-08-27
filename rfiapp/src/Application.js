import './Application.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Application({ user }) {
    const navigate = useNavigate()
    const location = useLocation();
    const jobId = location.state?.jobId;


    console.log("User object:", user);
    console.log("jobId from location.state:", jobId);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const fileInput = form.elements.resume;

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append('resume', fileInput.files[0]);
        formData.append('userId', user._id);
        formData.append('jobId', jobId);

        if (!user || !user._id || !jobId) {
            alert("User or Job ID missing.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/application", {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            alert(result.message);
        } catch (err) {
            console.error("Upload error:", err);
            alert("There was an error uploading the resume.");
        }

        console.log("Sending userId:", user?._id);
        console.log("Sending jobId:", jobId);
    };


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
            <div className='card1'>

                <h1 className='head'>Apply</h1>
                <p className='tagline'>Please drop your resume here</p>
                <form method='POST' encType='multipart/form-data' className='form-tag' onSubmit={handleSubmit}>
                    <input type='file' name='resume' className='fileUpload' />
                    <button type='submit' className='upload-btn'>Upload Resume</button>
                </form>
            </div>
        </div>

    )
}
