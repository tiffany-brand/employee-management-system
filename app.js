const EmpData = require('./lib/EmpData');
const connection = require('./lib/dbConn');
const cTable = require('console.table');
const inquirer = require('inquirer');

// create a new db access object to access SQL query functions
const empData = new EmpData(connection);

// Use inquirer to prompt user for information
const promptUser = (questions) => {
    return inquirer.prompt(questions);
};

const viewEmployees = async () => {
    try {
        const rows = await empData.getEmployees()
        console.table(rows);
        init();

    } catch (err) {
        console.log(err);
    }
}

// Function to exit the application
const exitApp = () => {
    console.log('Goodbye.');
    connection.end();
};

const actionFunctions = {
    'View All Employees': viewEmployees,
    // 'View All Employees by Department': viewEmpByDept,
    'Exit Application': exitApp
}


const action = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'task',
        choices: [
            'View All Employees',
            'View All Employees by Department',
            'View All Employees by Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'View All Departments',
            'Add Department',
            'Add Role',
            'Exit Application'
        ]
    }
];

const init = async () => {
    try {
        const actionChoice = await promptUser(action);
        actionFunctions[actionChoice.task]();
    } catch (err) {
        console.log(err);
    }
};

init();


