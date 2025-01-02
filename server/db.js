const mysql = require("mysql2");

const conn = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "exp_test",
});

module.exports = conn;
