const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");
const pool = require("./db.js");
require("dotenv").config();

const generateToken = () => {
    return crypto.randomBytes(20).toString("hex");
};

const expirationDate = () => {
    return moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss");
};

const getNow = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
};

const selectUser = async (id) => {
    const rs = await pool.query("select * from users where id = ?", [id]);
    return rs[0][0];
};

const insertUser = async (email, password, token, expiry) => {
    const query = `INSERT INTO users (email, password, confirmationToken, tokenExpiry) VALUES (?, ?, ?, ?)`;
    return await pool.query(query, [email, password, token, expiry]);
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

function sendConfirmEmail(email, link, expirationDate) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Account confirmation",
        text: `Please Confirm Your Account By Going: ${link}\nToken Expires at: ${expirationDate}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) return console.log(error);

        console.log("Email sent: " + info.response);
    });
}

function sendResetEmail(email, token, expirationDate) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Account Reset",
        text: `Your reset token is: ${token}\nExpires at: ${expirationDate}`,
        html: `<p>Your reset token is: <strong>${token}</strong></p>
               <p>Expires at: ${expirationDate}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) return console.log(error);

        console.log("Email sent: " + info.response);
    });
}

module.exports = {
    sendConfirmEmail,
    sendResetEmail,
    generateToken,
    expirationDate,
    insertUser,
    selectUser,
    getNow,
};
