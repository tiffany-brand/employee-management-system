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
                message: "Which department would you like to remove?"
            },

        ]);

        // search for roles in this department
        const deptRoles = await empData.getRolesByDept(remove.deptId);

        if (deptRoles.length) {
            console.log("\n------------------------\n")
            console.log("WARNING: This department contains roles in use:")
            deptRoles.forEach((role) => {
                console.log(role.title)
            })
            console.log("If you remove this department, all roles and employees in this department WILL ALSO BE REMOVED!")
            console.log("\n------------------------\n")
        }

        const removeDept = await empData.getDeptById(remove.deptId);

        const confirm = await promptUser([
            {
                name: "yN",
                type: "confirm",
                default: false,
                message: `\nAre you sure you want to remove ${removeDept[0].department}? THIS CANNOT BE UNDONE!`
            }
        ]);
        if (confirm.yN) {
            await empData.removeDepartment(remove.deptId)
            console.log(`\n${removeDept[0].department} department has been removed.`)

        }
        // if roles are found
        // ask user to change role to another department?
        // const id = parseInt(remove.deptId)
        // await empData.removeDepartment(id);
        // console.log(`Removed!`)


    } catch (err) {
        console.log(err)
    }
}

const delRole = async () => {
    try {
        const roles = await empData.getRoles();
        const remove = await promptUser([

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
                message: "Which role would you like to remove?"
            },

        ]);

        // search for employees with this role
        const roleEmps = await empData.getEmployeesByRole(remove.roleId);
        console.table(roleEmps)
        if (roleEmps.length) {
            console.log("\n------------------------\n")
            console.log("WARNING: This role is assigned to active employees:")
            roleEmps.forEach((emp) => {
                console.log(`${emp.first_name} ${emp.last_name}`)
            })
            console.log("If you remove this role, all employees assigned this role WILL ALSO BE REMOVED!")
            console.log("\n------------------------\n")
        }

        const removeRole = await empData.getRoleById(remove.roleId);

        const confirm = await promptUser([
            {
                name: "yN",
                type: "confirm",
                default: false,
                message: `\nAre you sure you want to remove ${removeRole[0].title}? THIS CANNOT BE UNDONE!`
            }
        ]);
        if (confirm.yN) {
            await empData.removeRole(remove.roleId)
            console.log(`\n${removeRole[0].title} role has been removed.`)

        }
        // if roles are found
        // ask user to change role to another department?
        // const id = parseInt(remove.deptId)
        // await empData.removeDepartment(id);
        // console.log(`Removed!`)


    } catch (err) {
        console.log(err)
    }
}







module.exports = { delDepartment, delEmployee, delRole }