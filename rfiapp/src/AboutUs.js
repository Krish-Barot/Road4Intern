import './AboutUs.css'
import { Link, useNavigate } from 'react-router-dom'

export default function AboutUs({ user }) {

    const navigate = useNavigate()

    async function Signup() {
        navigate("/signup");
    }

    async function Login() {
        navigate("/login");
    }
    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }
    return (
        <div className='homepages'>
            <div className="heading">
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
            </div>

            <div className='bodySection'>
                <h1 className='headLine'>About Us</h1>
            </div>
            <div className='Aboutcontainer'>
                <img className='internshipImg' src='/images/internshipImage.png' />
                <p className='aboutRoad4Intern'>Road4Intern is your dedicated platform to guide students toward securing dream internships. It offers curated resources, expert tips, and step-by-step roadmaps for various career fields. From resume building to interview prep, Road4Intern simplifies the internship hunt. Join us to fast-track your professional journey!</p>
            </div>
            <div className='Aboutcontainer'>
                <p className='aboutRoad4Intern'>Hi, I'm <strong>Krish Barot</strong>, the creator of <strong>Road4Intern</strong>.

                    As a passionate software development student at Seneca College, I understand how challenging it can be for students and new grads to find the right internship opportunities. I built <strong>Road4Intern</strong> with a mission — to simplify and streamline the internship search process for aspiring professionals.

                    With a strong foundation in technologies like <strong>JavaScript, React, Node.js and MongoDB</strong> , I created this platform to bridge the gap between talent and opportunity.</p>
                <img className='myImg' src='/images/myPhoto.jpg' />
            </div>
        </div>
    )
}