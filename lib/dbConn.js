const mysql = require('mysql');

// Create Database Connection
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'root',
    database: 'employee_msdb'
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    // console.log("Successfully connected to the database.");
});

module.exports = connection;