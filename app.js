const EmpData = require('./lib/EmpData');
const connection = require('./lib/dbConn');
const cTable = require('console.table');
const figlet = require('figlet');
const inquirer = require('inquirer');
const view = require('./lib/viewFuncs');
const add = require('./lib/addFuncs');
const del = require('./lib/delFuncs');
const update = require('./lib/updateFuncs');


// Use inquirer to prompt user for information
const promptUser = (questions) => {
    return inquirer.prompt(questions);
};


// Function to exit the application
const exitApp = () => {
    console.log('Goodbye!');
    connection.end();
    process.exit();
};

const actionFunctions = {
    'View All Employees': view.viewEmployees,
    'View All Employees by Department': view.viewEmployeesByDept,
    'View All Employees by Manager': view.viewEmployeesByMgr,
    'Add Employee': add.addEmployee,
    'Remove Employee': del.delEmployee,
    'Update Employee Role': update.updateEmpRole,
    'Update Employee Manager': update.updateEmpMgr,
    'View All Roles': view.viewRoles,
    'Add Role': add.addRole,
    'Remove Role': del.delRole,
    'View All Departments': view.viewDepartments,
    'View Budget by Department': view.viewBudgetByDept,
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
            'Remove Role',
            'View All Departments',
            'View Budget by Department',
            'Add Department',
            'Remove Department',
            'Exit Application'
        ]
    }
];

const init = async () => {
    try {
        console.log("\n------------------------\n")
        const actionChoice = await promptUser(action);
        console.log("\n------------------------\n")
        await actionFunctions[actionChoice.task]();
        init();
    } catch (err) {
        console.log(err);
    }
};

const start = () => {
    figlet('     E - M - S', {
        font: 'Big'
    }, (err, data) => {
        if (err) {
            console.log(err)
        }
        console.log("\n")
        console.log(data);
        console.log("       ****************************************")
        console.log("\n                    Welcome to the \n             Employee Management System!")
        console.log("\n       ****************************************")
        init();
    })

}

start();




