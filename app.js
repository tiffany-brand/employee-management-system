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

const viewRoles = async () => {
    try {
        const rows = await empData.getRoles()
        console.log(rows);
        console.table(rows);
        init();
    } catch (err) {
        console.log(err)
    }
}

const viewDepartments = async () => {
    try {
        const rows = await empData.getDepartments()
        console.table(rows);
        init();
    } catch (err) {
        console.log(err)
    }
}

const addEmployee = async () => {
    try {
        const roles = await empData.getRoles();
        const employees = await empData.getEmployees();
        const newEmp = await promptUser([
            {
                type: 'input',
                message: "Enter the employee's first name:",
                name: 'empFirst'
            },
            {
                type: 'input',
                message: "Enter the employee's last name:",
                name: 'empLast'
            },
            {
                name: "empRole",
                type: "rawlist",
                choices: function () {
                    const choiceArray = [];
                    roles.forEach((role) => {
                        const roleObj = {
                            name: role.title,
                            value: role.id
                        }
                        choiceArray.push(roleObj)
                    })
                    return choiceArray;
                },
                message: "Choose the employee's role:"
            },
            {
                name: "empMgr",
                type: "rawlist",
                choices: function () {
                    const choiceArray = [{ name: "None", value: -1 }];
                    employees.forEach((employee) => {
                        const mgrObj = {
                            name: employee.first_name + " " + employee.last_name,
                            value: employee.id
                        }
                        choiceArray.push(mgrObj)
                    })
                    return choiceArray;
                },
                message: "Choose the employee's manager:"
            },


        ]);

        console.log(newEmp);
        await empData.createEmployee(newEmp);
        console.log(`${newEmp.empFirst} ${newEmp.empLast} added!`)

        init();
    } catch (err) {
        console.log(err)
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
    'Add Employee': addEmployee,
    'View All Roles': viewRoles,
    'View All Departments': viewDepartments,
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


