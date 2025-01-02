require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const moment = require("moment");

const crypto = require("crypto");

const generateToken = () => {
    return crypto.randomBytes(20).toString("hex");
};

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

app.get("/send-email", (req, res) => {
    const token = generateToken();
    const expirationDate = moment()
        .add(1, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

    sendEmail("imad.rouah@usmba.ac.ma", token, expirationDate);

    res.send("Email sent");
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

function sendEmail(email, token, expirationDate) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset Token",
        text: `Your reset token is: ${token}\nExpires at: ${expirationDate}`,
        html: `<p>Your reset token is: <strong>${token}</strong></p>
               <p>Expires at: ${expirationDate}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) return console.log(error);

        console.log("Email sent: " + info.response);
    });
}

app.listen(3000, (err) => {
    if (err) return console.log(err);
    console.log("listenning on 3000");
});
