import axios from "axios";
import { useCallback, useState } from "react";
import Login from "./components/Login";
import "./index.css";

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = useCallback(async (email, password) => {
        axios
            .post("http://localhost:3000/login", { email, password })
            .then(({ data }) => {
                console.log(data);
                if (data?.message.length) setLoggedIn(true);
            })
            .catch((e) => {
                console.log(e.response);
            });
    }, []);

    axios
        .get("http://localhost:3000/login")
        .then(({ data }) => {
            console.log(data);

            if (data === "Logged in") setLoggedIn(true);
        })
        .catch((e) => {
            console.log(e.response);
            setLoggedIn(false);
        });

    return (
        <div>
            {loggedIn ? (
                <h1>Welcome</h1>
            ) : (
                <Login handleSubmit={handleSubmit} />
            )}
        </div>
    );
};

export default App;
