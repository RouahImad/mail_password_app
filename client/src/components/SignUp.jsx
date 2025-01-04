import PropTypes from "prop-types";
import { useState } from "react";

const SignUp = ({ handleSignUp, setSignUp }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="signup">
            <h1>Sign Up</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignUp();
                }}
            >
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value.trim())}
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value.trim())}
                    value={password}
                />
                <p>
                    you already have an account?{" "}
                    <span onClick={() => setSignUp(false)}>login</span>
                </p>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

SignUp.propTypes = {
    handleSignUp: PropTypes.func.isRequired,
    setSignUp: PropTypes.func.isRequired,
};

export default SignUp;
