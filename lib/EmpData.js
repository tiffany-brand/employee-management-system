const connection = require("./dbConn.js");
const util = require('util');

// Use promises with MySQL Queries
const query = util.promisify(connection.query).bind(connection);

class EmpData {
    constructor(query) {
        this.query = query;
    }

    getEmployees() {
        return query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) ORDER BY employee.id');
    }

    getRoles() {
        return query('SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id')
    }

    getDepartments() {
        return query('SELECT department.id, department.name AS department FROM department')
    }

}


module.exports = EmpData;