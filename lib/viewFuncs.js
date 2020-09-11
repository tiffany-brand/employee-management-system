const EmpData = require('./EmpData');
const cTable = require('console.table');
const inquirer = require('inquirer');


// create a new db access object to access SQL query functions
const empData = new EmpData();

// Use inquirer to prompt user for information
const promptUser = (questions) => {
    return inquirer.prompt(questions);
};

// functions to view Employee Management Data

// View all employees
const viewEmployees = async () => {
    try {
        // query the db for employee information and display it
        const rows = await empData.getEmployees()
        console.table(rows);

    } catch (err) {
        console.log(err);
    }
}

// View all roles
const viewRoles = async () => {
    try {
        // query the db for role information and display it
        const rows = await empData.getRoles()
        console.table(rows);

    } catch (err) {
        console.log(err)
    }
}

// View all departments
const viewDepartments = async () => {
    try {
        // query the db for department information and display it
        const rows = await empData.getDepartments()
        console.table(rows);

    } catch (err) {
        console.log(err)
    }
}

// Choose a department and view all of its employees
const viewEmployeesByDept = async () => {
    try {
        // get list od departments to populate the inquirer prompt
        const departments = await empData.getDepartments();
        // ask the user for the department to view
        const chosenDept = await promptUser([
            {
                name: "deptId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    departments.forEach((dept) => {
                        const deptObj = {
                            name: dept.department,
                            value: dept.id
                        }
                        choiceArray.push(deptObj)
                    })
                    return choiceArray;
                },
                message: "Which department's employees would you like to view'?"
            },

        ]);

        // get the list of employees in the chosen department and display it
        const rows = await empData.getEmployeesByDept(chosenDept.deptId);
        console.log("\n")
        console.table(rows);

    } catch (err) {
        console.log(err)
    }
}

// Choose a manager and view all of that manager's employees
const viewEmployeesByMgr = async () => {
    try {
        // get list of employees (managers) to populate the inquirer prompt
        const employees = await empData.getEmployees();
        const chosenMgr = await promptUser([
            {
                name: "mgrId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    employees.forEach((emp) => {
                        const mgrObj = {
                            name: `${emp.first_name} ${emp.last_name}`,
                            value: emp.id
                        }
                        choiceArray.push(mgrObj)
                    })
                    return choiceArray;
                },
                message: "Which manager's employees would you like to view'?"
            },

        ]);

        // get the employees with the chosen manager
        const rows = await empData.getEmployeesByMgr(chosenMgr.mgrId);
        // if the manager has no employees, tell the user
        if (!rows.length) {
            console.log("This manager has no employees.");
        } else {
            // display the manager's employees
            console.log("\n------------------------\n")
            console.table(rows);

        }

    } catch (err) {
        console.log(err)
    }
}

// View the total utilized budget (sum of salaries of all employees) within a chosen department
const viewBudgetByDept = async () => {
    try {
        // get a list of departments to populate the inquirer prompt
        const departments = await empData.getDepartments();
        // prompt the user to choose a department
        const chosenDept = await promptUser([
            {
                name: "deptId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    departments.forEach((dept) => {
                        const deptObj = {
                            name: dept.department,
                            value: dept.id
                        }
                        choiceArray.push(deptObj)
                    })
                    return choiceArray;
                },
                message: "Which department's total utilized budget would you like to view'?"
            },
        ]);

        // query the database to sum the salaries of employees in the chosen department
        const rows = await empData.getBudgetByDept(chosenDept.deptId);
        // if a result is returned, display it
        if (rows.length) {
            console.log("\n")
            console.table(rows);

        } else {
            // otherwise, there are no employees in the department - tell the user
            console.log("\n------------------------\n")
            console.log("This department currently has no active employees.")
            console.log("\n------------------------\n")
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports = { viewEmployees, viewRoles, viewDepartments, viewEmployeesByDept, viewEmployeesByMgr, viewBudgetByDept }