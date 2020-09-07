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

        const id = parseInt(remove.deptId)
        await empData.removeDepartment(id);
        console.log(`Removed!`)


    } catch (err) {
        console.log(err)
    }
}






module.exports = { delDepartment }