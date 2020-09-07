const EmpData = require('./lib/EmpData');
const connection = require('./lib/dbConn');
const cTable = require('console.table');
const inquirer = require('inquirer');
const view = require('./lib/viewFuncs')
const add = require('./lib/addFuncs')

// create a new db access object to access SQL query functions
const empData = new EmpData(connection);

// Use inquirer to prompt user for information
const promptUser = (questions) => {
    return inquirer.prompt(questions);
};


// Function to exit the application
const exitApp = () => {
    console.log('Goodbye.');
    connection.end();
    process.exit();
};

const actionFunctions = {
    'View All Employees': view.viewEmployees,
    // 'View All Employees by Department': viewEmpByDept,
    'Add Employee': add.addEmployee,
    'View All Roles': view.viewRoles,
    'View All Departments': view.viewDepartments,
    'Add Department': add.addDepartment,
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
        await actionFunctions[actionChoice.task]();
        init();
    } catch (err) {
        console.log(err);
    }
};

init();


