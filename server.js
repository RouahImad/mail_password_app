require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const mailOptions = {
    from: process.env.EMAIL,
    to: "imad.rouah@usmba.ac.ma",
    subject: "Sending Email using Node.js",
    text: "That was easy!👉❤",
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) return console.log(error);

    console.log("Email sent: " + info.response);
});

app.listen(3000, (err) => {
    if (err) return console.log(err);
    console.log("listenning on 3000");
});
