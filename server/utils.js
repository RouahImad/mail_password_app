const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");
const pool = require("./db.js");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const generateToken = () => {
    return crypto.randomBytes(20).toString("hex");
};

const expirationDate = () => {
    return moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss");
};

const getNow = () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
};

const selectUser = async (email, password) => {
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    const [users] = await pool.query(query, [email, password]);
    return users;
};

const insertUser = async (
    username,
    email,
    password,
    token,
    confirmed,
    expiry
) => {
    const query = `INSERT INTO users (username, email, password, confirmationToken, 
                    confirmed, tokenExpiry) VALUES (?, ?, ?, ?, ?, ?)`;
    return await pool.query(query, [
        username,
        email,
        password,
        token,
        confirmed,
        expiry,
    ]);
};

function sendConfirmEmail(name, email, link, expirationDate) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Account confirmation",
        text: `Hey ${name} Thank You For Joining Us\nPlease Confirm Your Account By Going To This Link: ${link}\nToken Expires at: ${expirationDate}\nFarewell.`,
    };
    console.log("sending email...");

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Email sent: " + info.response);
                resolve(info);
            }
        });
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
