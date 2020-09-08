const EmpData = require('./EmpData');
const cTable = require('console.table');
const inquirer = require('inquirer');


// create a new db access object to access SQL query functions
const empData = new EmpData();

// Use inquirer to prompt user for information
const promptUser = (questions) => {
    return inquirer.prompt(questions);
};

const delEmployee = async () => {
    try {

        // inquirer choose employee
        const employees = await empData.getEmployees()
        const deleteEmp = await promptUser([

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
                message: "Which employee would you like to remove?"
            },

        ]);


        const directReports = await empData.getEmployeesWithMgr(deleteEmp.empId);
        if (directReports.length) {
            console.log("\n------------------------\n")
            console.log("This employee is a manager. \nYou must assign these employees a new manager before this employee can be removed:\n")
            directReports.forEach((emp) => {
                console.log(`${emp.first_name} ${emp.last_name}`)
            })
            console.log("Choose the 'Update Employee Manager' task.")


        } else {
            const empToRemove = await empData.getEmployeeById(deleteEmp.empId)

            const confirm = await promptUser([
                {
                    name: "yN",
                    type: "confirm",
                    default: false,
                    message: `\nAre you sure you want to remove ${empToRemove[0].first_name} ${empToRemove[0].last_name}?`
                }
            ]);
            if (confirm.yN) {
                await empData.removeEmployee(deleteEmp.empId)
                console.log(`\n${empToRemove[0].first_name} ${empToRemove[0].last_name} has been removed.`)
            }
        }


        // get employees by mgr


        // if no employees (not a manager) - delete employee
        // tell user - sorry, this employee is a manager. You must reassign employees first.


    } catch (err) {
        console.log(err)
    }
}



const delDepartment = async () => {
    try {
        const departments = await empData.getDepartments();
        const remove = await promptUser([

            {
                name: "deptId",
                type: "rawlist",
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
                message: "Which department would you like to remove?"
            },

        ]);

        // search for roles in this department
        // if roles are found
        // ask user to change role to another department?
        const id = parseInt(remove.deptId)
        await empData.removeDepartment(id);
        console.log(`Removed!`)


    } catch (err) {
        console.log(err)
    }
}






module.exports = { delDepartment, delEmployee }