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


const updateEmpRole = async () => {
    try {
        const employees = await empData.getEmployees();
        const roles = await empData.getRoles();
        const updateEmp = await promptUser([

            {
                name: "empId",
                type: "rawlist",
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
                message: "Choose the employee's new role:"
            },
        ]);

        await empData.updateEmpRole(newRole.roleId, updateEmp.empId)
        console.log("Role Updated.")

    } catch (err) {
        console.log(err);
    }

}


module.exports = { updateEmpRole }