require("dotenv").config();
const express = require("express");
const app = express();
const {
    sendConfirmEmail,
    sendResetEmail,
    generateToken,
    expirationDate,
    insertUser,
    selectUser,
    getNow,
} = require("./utils.js");

app.use(express.json());

// const session = require("express-session");
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             secure: false,
//             httpOnly: true,
//             maxAge: 1000 * 60 * 60, // 1 hour
//         },
//     })
// );

const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        keys: [process.env.SESSION_SECRET],
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60,
    })
);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, DELETE, POST, PUT"
    );
    if (req.method === "OPTIONS") return res.end();

    next();
});

app.get("/login", (req, res) => {
    if (!req.session.user) return res.status(401).send("Not logged in");
    if (req.session.user.confirmed == "1")
        return res.json({
            message: "Logged in",
            user: req.session?.user.username,
        });
    res.send("Please confirm your account");
});

app.post("/login", async (req, res) => {
    if (req.session?.user?.confirmed == "0")
        return res.send("Please confirm your account");

    const { email, password } = req.body;
    if (
        req.session?.user?.password == password &&
        req.session?.user?.email == email
    )
        return res.json({
            message: "Logged in successfully",
            user: req.session?.user.username,
        });

    try {
        const users = await selectUser(email, password);

        if (!users.length)
            return res.status(401).json({ error: "Invalid credentials" });
        req.session.user = users[0];

        return res.json({
            message: "Logged in successfully",
            user: users[0].username,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});

app.post("/register", async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username)
            return res.status(401).json({ error: "Credentials Needed" });

        const token = generateToken();
        const expiry = expirationDate();
        req.session.user = {
            username,
            email,
            password,
            confirmed: 0,
            confirmationToken: token,
            tokenExpiry: expiry,
        };

        let fullUrl =
            req.protocol + "://" + req.get("host") + "/confirm/" + token;

        try {
            await sendConfirmEmail(username, email, fullUrl, expiry);
            return res.json({
                message:
                    "Registration successful, please confirm your email to finish the sign up",
            });
        } catch (error) {
            console.error("Failed to send email:", error);
            return res.status(500).json({
                error: "Registration failed, failed to send the email",
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: "Registration failed" });
    }
});

app.get("/confirm/:slug", async (req, res) => {
    const { slug } = req.params;

    if (!slug) return res.status(401).json({ error: "Invalid Token" });
    if (!req.session.user) return res.status(401).send("No Session Found");
    if (req.session.user.confirmed == "1")
        return res.send("Account Already Confirmed");
    if (req.session.user.confirmationToken != slug)
        return res.status(401).send("Wrong Token");
    if (req.session.user.tokenExpiry < getNow())
        return res.status(401).send("Token Expired!! Please sign up again");
    const { username, email, password } = req.session.user;
    try {
        await insertUser(username, email, password, null, 1, null);
        req.session.user = {
            ...req.session.user,
            confirmationToken: null,
            confirmed: 1,
            tokenExpiry: null,
        };

        return res.send("Account confirmed");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});

app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(3000, (err) => {
    if (err) return console.error(err);
    console.log("listenning on 3000");
});

// app.post("/forgot-password", async (req, res) => {
//     try {
//         const { email } = req.body;
//         const query = `SELECT * FROM users WHERE email = ?`;
//         const [users] = await pool.query(query, [email]);

//         if (!users.length) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const token = generateToken();
//         const expiry = expirationDate();

//         await sendEmail(email, token, expiry);
//         return res.json({ message: "Reset email sent" });
//     } catch (err) {
//         return res.status(500).json({ error: "Failed to process request" });
//     }
// });

// app.get("/send-email", (req, res) => {
//     const token = generateToken();

//     sendEmail("imad.rouah@usmba.ac.ma", token, expirationDate());

//     res.send("Email sent");
// });
