const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");
require("dotenv").config();

const generateToken = () => {
    return crypto.randomBytes(20).toString("hex");
};

const expirationDate = () => {
    return moment().add(1, "hours").format("YYYY-MM-DD HH:mm:ss");
};

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

module.exports = { sendEmail, generateToken, expirationDate };
