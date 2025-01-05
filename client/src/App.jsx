import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Login from "./components/Login";
import "./index.css";
import SignUp from "./components/SignUp";

const App = () => {
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState("");
    const [signUp, setSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (email, password) => {
        setLoading(true);
        axios
            .post(
                "http://localhost:3000/login",
                { email, password },
                {
                    withCredentials: true,
                }
            )
            .then(({ data }) => {
                console.log(data);

                alert(data?.message.length ? data?.message : data);
                if (data?.message.length) {
                    setUser(data.user);
                    setLogin(true);
                }
            })
            .catch((e) => {
                if (400 <= e.response.status < 500)
                    alert(e.response.data?.error);
                console.log(e.response);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSignUp = useCallback(async (username, email, password) => {
        setLoading(true);
        axios
            .post(
                "http://localhost:3000/register",
                {
                    username,
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            )
            .then(({ data }) => {
                console.log(data);
                alert(data?.message.length ? data?.message : data);

                alert(data);
            })
            .catch((e) => {
                if (400 <= e.response.status < 500)
                    alert(e.response.data?.error);
                console.log(e.response);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        console.clear();
        console.log("checking loggin");

        setLoading(true);
        axios
            .get("http://localhost:3000/login", {
                withCredentials: true,
            })
            .then(({ data }) => {
                console.log(data);

                if (data?.message === "Logged in") {
                    setUser(data.user);
                    setLogin(true);
                }
            })
            .catch((e) => {
                console.log(e.response);
                setLogin(false);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {login ? (
                <h1>Welcome {user}</h1>
            ) : signUp ? (
                <SignUp handleSignUp={handleSignUp} setSignUp={setSignUp} />
            ) : (
                <Login handleSubmit={handleSubmit} setSignUp={setSignUp} />
            )}
            {loading ?? <div>Loading</div>}
        </div>
    );
};

export default App;
