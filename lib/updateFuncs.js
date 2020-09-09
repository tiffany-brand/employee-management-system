const EmpData = require('./EmpData');
const cTable = require('console.table');
const inquirer = require('inquirer');


// create a new db access object to access SQL query functions
const empData = new EmpData();

// Use inquirer to prompt user for information
const promptUser = (questions) => {
    return inquirer.prompt(questions);
};


const updateEmpRole = async () => {
    try {
        const employees = await empData.getEmployees();
        const roles = await empData.getRoles();
        const updateEmp = await promptUser([

            {
                name: "empId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    employees.forEach((emp) => {
                        const empObj = {
                            name: `${emp.first_name} ${emp.last_name}`,
                            value: emp.id
                        }
                        choiceArray.push(empObj)
                    })
                    return choiceArray;
                },
                message: "Which employee's role would you like to update?"
            },

        ]);

        const newRole = await promptUser([
            {
                name: "roleId",
                type: "list",
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
                message: "Choose the employee's new role:"
            },
        ]);

        await empData.updateEmpRole(newRole.roleId, updateEmp.empId)
        console.log("\n")
        console.log("Role Updated.")

    } catch (err) {
        console.log(err);
    }

}

const updateEmpMgr = async () => {
    try {
        const employees = await empData.getEmployees();

        const updateEmp = await promptUser([

            {
                name: "empId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    employees.forEach((emp) => {
                        const empObj = {
                            name: `${emp.first_name} ${emp.last_name}`,
                            value: emp.id
                        }
                        choiceArray.push(empObj)
                    })
                    return choiceArray;
                },
                message: "Which employee's manager would you like to update?"
            },

        ]);

        const managers = employees.filter((emp) => {
            return emp.id !== updateEmp.empId
        })

        const newMgr = await promptUser([
            {
                name: "mgrId",
                type: "list",
                choices: function () {
                    const choiceArray = [];
                    managers.forEach((mgr) => {
                        const mgrObj = {
                            name: `${mgr.first_name} ${mgr.last_name}`,
                            value: mgr.id
                        }
                        choiceArray.push(mgrObj)
                    })
                    return choiceArray;
                },
                message: "Choose the employee's new manager:"
            },
        ]);

        await empData.updateEmpMgr(newMgr.mgrId, updateEmp.empId)
        console.log("\n")
        console.log("Manager Updated.")

    } catch (err) {
        console.log(err);
    }

}


module.exports = { updateEmpRole, updateEmpMgr }