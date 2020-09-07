const EmpData = require('./EmpData');
const connection = require('./dbConn');
const cTable = require('console.table');
const inquirer = require('inquirer');


// create a new db access object to access SQL query functions
const empData = new EmpData(connection);

// Use inquirer to prompt user for information
const promptUser = (questions) => {
    return inquirer.prompt(questions);
};

// functions to view Employee Management Data

const viewEmployees = async () => {
    try {
        const rows = await empData.getEmployees()
        console.table(rows);


    } catch (err) {
        console.log(err);
    }
}

const viewRoles = async () => {
    try {
        const rows = await empData.getRoles()
        console.log(rows);
        console.table(rows);

    } catch (err) {
        console.log(err)
    }
}

const viewDepartments = async () => {
    try {
        const rows = await empData.getDepartments()
        console.table(rows);

    } catch (err) {
        console.log(err)
    }
}

module.exports = { viewEmployees, viewRoles, viewDepartments }