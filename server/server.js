require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const pool = require("./db.js");
const { sendEmail, generateToken, expirationDate } = require("./utils.js");

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60, // 1 hour
        },
    })
);

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, DELETE, POST, PUT"
    );
    if (req.method === "OPTIONS") return res.end();
    next();
});

app.get("/login", (req, res) => {
    if (req.session.user) return res.send("Logged in");
    res.status(401).send("Not logged in");
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
        const [users] = await pool.query(query, [email, password]);

        if (!users.length)
            return res.status(401).json({ error: "Invalid credentials" });

        req.session.user = users[0];
        return res.json({ message: "Logged in successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
});

app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = `INSERT INTO users (email, password, confirmationToken, tokenExpiry) VALUES (?, ?, ?, ?)`;
        const token = generateToken();
        const expiry = expirationDate();
        await pool.query(query, [email, password, token, expiry]);
        sendEmail(email, token, expiry);
        return res.json({ message: "Registration successful" });
    } catch (err) {
        return res.status(400).json({ error: "Registration failed" });
    }
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

app.listen(3000, (err) => {
    if (err) return console.log(err);
    console.log("listenning on 3000");
});
