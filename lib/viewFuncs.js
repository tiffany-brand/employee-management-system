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

const viewEmployeesByDept = async () => {
    try {
        const departments = await empData.getDepartments();
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

        const rows = await empData.getEmployeesByDept(chosenDept.deptId);
        console.log("\n")
        console.table(rows);

    } catch (err) {
        console.log(err)
    }
}

const viewEmployeesByMgr = async () => {
    try {
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

        const rows = await empData.getEmployeesByMgr(chosenMgr.mgrId);

        if (!rows.length) {
            console.log("This manager has no employees.");
        } else {
            console.log("\n------------------------\n")
            console.table(rows);

        }



    } catch (err) {
        console.log(err)
    }
}


const viewBudgetByDept = async () => {
    try {
        const departments = await empData.getDepartments();
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

        const rows = await empData.getBudgetByDept(chosenDept.deptId);

        if (rows.length) {
            console.log("\n")
            console.table(rows);

        } else {
            console.log("\n------------------------\n")
            console.log("This department currently has no active employees.")
            console.log("\n------------------------\n")
        }



    } catch (err) {
        console.log(err)
    }
}

module.exports = { viewEmployees, viewRoles, viewDepartments, viewEmployeesByDept, viewEmployeesByMgr, viewBudgetByDept }