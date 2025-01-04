import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Login from "./components/Login";
import "./index.css";
import SignUp from "./components/SignUp";

const App = () => {
    const [login, setLogin] = useState(false);
    const [signUp, setSignUp] = useState(false);

    const handleSubmit = useCallback(async (email, password) => {
        axios
            .post("http://localhost:3000/login", { email, password })
            .then(({ data }) => {
                console.log(data);
                if (data?.message.length) setLogin(true);
            })
            .catch((e) => {
                console.log(e.response);
            });
    }, []);

    const handleSignUp = useCallback(async (email, password) => {
        axios
            .post("http://localhost:3000/register", { email, password })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((e) => {
                console.log(e.response);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:3000/login")
            .then(({ data }) => {
                console.log(data);

                if (data === "Logged in") setLogin(true);
            })
            .catch((e) => {
                console.log(e.response);
                setLogin(false);
            });
    }, []);

    return (
        <div>
            {login ? (
                <h1>Welcome</h1>
            ) : signUp ? (
                <SignUp handleSignUp={handleSignUp} setSignUp={setSignUp} />
            ) : (
                <Login handleSubmit={handleSubmit} setSignUp={setSignUp} />
            )}
        </div>
    );
};

export default App;
