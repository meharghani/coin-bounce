
import { useState } from "react";
import styles from "./Login.module.css";
import TextInput from "../../components/textInput/TextInput";
import loginSchema from "../../Schemas/loginSchema";
import { useFormik } from "formik";
import { login } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [error, setError] = useState('')

    const { values, touched, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: loginSchema
    });
    const handleLogin = async () => {
        const data = {
            username: values.username,
            password: values.password,
        }

        const response = await login(data)

        if (response.status === 200) {
            //set user
            const user = {
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth
            }
            dispatch(setUser(user));
            //Redirect to homepage
            navigate('/blogs')

        } else if (response.code === 'ERR_BAD_REQUEST') {
            //display error message
            setError(response.response.data.message)
        }
    }




    return (
        <div className={styles.loginWrapper}>
            <div className={styles.loginHeader}>Log in to your account</div>
            <TextInput
                type="text"
                value={values.username}
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Username"
                error={errors.username && touched.username ? 1 : undefined}
                errormessage={errors.username}
            />
            <TextInput
                type="password"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Password"
                error={errors.password && touched.password ? 1 : undefined}
                errormessage={errors.password}
            />
            <button className={styles.loginButton} onClick={handleLogin} disabled={!values.username || !values.password || errors.username || errors.password} >Login</button>
            {error !== '' ? <p className={styles.errorMessage}>{error}</p> : ''}
            <span>
                Don't have an account?{" "}
                <button className={styles.createAccount} onClick={() => navigate('/signup')}>Register</button>
            </span>

        </div>
    );
}

export default Login;
