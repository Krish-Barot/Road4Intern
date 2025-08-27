import styles from './Signup.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "https://road4intern.me/loginapi/api/users";
            const { data: res } = await axios.post(url, data);
            navigate("/")
            console.log(res.message)
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div>
                    <form onSubmit={handleSubmit} className={styles.formTag}>
                        <h1 className={styles.signup}>Create Account</h1>
                        <input type='text' placeholder='Enter your name' name='name' value={data.name} required onChange={handleChange} className={styles.inputTag}/>
                        <input type='email' placeholder='Enter your email' name='email' value={data.email} required onChange={handleChange} className={styles.inputTag}/>
                        <input type='password' placeholder='Enter your password' name='password' value={data.password} required onChange={handleChange} className={styles.inputTag}/>
                        {error && <div>{error}</div>}
                        <button type='submit' className={styles.signupButton}>Sign Up</button>
                        <div className={styles}>
                            <h1>Already have an Account ? </h1>
                            <Link to="/login">
                                <button className={styles.loginButton}>Log In</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup