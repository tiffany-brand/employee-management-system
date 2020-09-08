const EmpData = require('./lib/EmpData');
const connection = require('./lib/dbConn');
const cTable = require('console.table');
const inquirer = require('inquirer');
const view = require('./lib/viewFuncs');
const add = require('./lib/addFuncs');
const del = require('./lib/delFuncs');
const update = require('./lib/updateFuncs');

// create a new db access object to access SQL query functions
// const empData = new EmpData(connection);

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
    'View All Employees by Department': view.viewEmployeesByDept,
    'View All Employees by Manager': view.viewEmployeesByMgr,
    'Add Employee': add.addEmployee,
    'Update Employee Role': update.updateEmpRole,
    'Update Employee Manager': update.updateEmpMgr,
    'View All Roles': view.viewRoles,
    'Add Role': add.addRole,
    'View All Departments': view.viewDepartments,
    'Add Department': add.addDepartment,
    'Remove Department': del.delDepartment,
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
            'Add Role',
            'View All Departments',
            'Add Department',
            'Remove Department',
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


