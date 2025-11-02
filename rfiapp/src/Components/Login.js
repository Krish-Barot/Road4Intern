import styles from './Login.module.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config';

const Login = ({ setUser }) => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = API_ENDPOINTS.AUTH;
            const response = await axios.post(url, data);

            const token = response.data.token;
            localStorage.setItem("token", token);

            const decodedUser = jwtDecode(token);
            setUser(decodedUser);

            navigate("/");
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div>
                    <form onSubmit={handleSubmit} className={styles.formTag}>
                        <h1 className={styles.login}>Login</h1>
                        <input type='email' placeholder='Enter your email' name='email' value={data.email} required onChange={handleChange} className={styles.inputTag} />
                        <input type='password' placeholder='Enter your password' name='password' value={data.password} required onChange={handleChange} className={styles.inputTag} />
                        {error && <div>{error}</div>}
                        <button type='submit' className={styles.loginButton}>
                            Login
                        </button>
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