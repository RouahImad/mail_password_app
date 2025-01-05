import PropTypes from "prop-types";
import { useState } from "react";

const Login = ({ handleSubmit, setSignUp }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="login">
            <h1>Login</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(email, password);
                }}
            >
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value.trim())}
                    value={email}
                    autoComplete="true"
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value.trim())}
                    value={password}
                    autoComplete="true"
                />
                <p>
                    you are new here?{" "}
                    <span onClick={() => setSignUp(true)}>sign up</span>
                </p>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

Login.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setSignUp: PropTypes.func.isRequired,
};

export default Login;
