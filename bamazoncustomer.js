const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",
    password: "root",
    database: "bamazonDB"
});