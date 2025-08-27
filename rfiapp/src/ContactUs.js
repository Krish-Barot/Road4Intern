import './ContactUs.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function ContactUs({ user }) {

    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [menuOpen, setMenuOpen] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("https://road4intern.me/api/contactUs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            })

            const data = await res.json()
            if (data.success) {
                alert("Feedback submitted successfully!")
                setName("")
                setEmail("")
                setMessage("")
            } else {
                alert("Failed to submit feedback: " + data.msg)
            }
        } catch (error) {
            console.error("Error submitting feedback:", error)
            alert("Server error, please try again later.")
        }
    }

    return (
        <div className='homepages'>
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
                <h1 className='headLine'>Contact Us</h1>
            </div>

            <div className='ContactContainer'>
                <img className='internshipImg' src='/images/contactUs.png' alt="Contact Us" />
                <p className='aboutRoad4Intern'>
                    We’d love to hear from you! Whether you have a question, feedback, or just want to say hello,
                    reach out to us anytime. Our team is here to support you in your internship journey.
                    <br /><br />
                    <strong>Email:</strong> krishjbarot@gmail.com <br />
                    <strong>Phone:</strong> +1 (647) 123-4567 <br />
                    <strong>Location:</strong> Toronto, Canada
                </p>
            </div>

            <div className='Aboutcontainer'>
                <form className='contactForm' onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Message</label>
                    <textarea
                        placeholder="Write your message..."
                        rows="5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>

                    <button type="submit" className='sendBtn'>Send Message</button>
                </form>

                <img className='myImg' src='/images/supportTeam.png' alt="Support Team" />
            </div>
        </div>
    )
}