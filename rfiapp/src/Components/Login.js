import styles from './Login.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://road4intern.me/loginapi/api/auth";
            const response = await axios.post(url, data);
            localStorage.setItem("token", response.data.token)
            navigate("/");
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }
    

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles}>
                    <form onSubmit={handleSubmit} className={styles.formTag}>
                        <h1 className={styles.login}>Login</h1>
                        <input type='email' placeholder='Enter your email' name='email' value={data.email} required onChange={handleChange} className={styles.inputTag} />
                        <input type='password' placeholder='Enter your password' name='password' value={data.password} required onChange={handleChange} className={styles.inputTag} />
                        {error && <div>{error}</div>}
                        <button type='submit' className={styles.loginButton}>Log In</button>
                        <div>
                            <h1>New Here ?</h1>
                            <Link to="/signup">
                                <button className={styles.signupButton}>Sign Up</button>
                            </Link>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login