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

    getEmployeeById(id) {
        return query('SELECT * from employee WHERE id = ?', [id]);
    }

    getEmployeesByDept(deptId) {
        return query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE department.id = ? ORDER BY employee.id', [deptId])
    }

    getEmployeesByMgr(mgrId) {
        return query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE employee.manager_id = ? ORDER BY employee.id', [mgrId])
    }

    getEmployeesByRole(roleId) {
        return query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) manager_name FROM ((employee LEFT JOIN employee manager ON manager.id = employee.manager_id) INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE role.id = ? ORDER BY employee.id', [roleId])
    }

    getEmployeesWithMgr(mgrId) {
        return query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee WHERE employee.manager_id = ? ORDER BY employee.id', [mgrId])
    }

    getRoles() {
        return query('SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id')
    }

    getRolesByDept(deptId) {
        return query('SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id WHERE department.id = ?', [deptId])
    }

    getRoleById(roleId) {
        return query('SELECT role.id, role.title, role.salary FROM role WHERE role.id = ?', [roleId])
    }

    getDepartments() {
        return query('SELECT department.id, department.name AS department FROM department')
    }

    getDeptById(deptId) {
        return query('SELECT department.id, department.name AS department FROM department WHERE department.id = ?', [deptId])
    }

    getBudgetByDept(deptId) {
        return query('SELECT department.name AS department, SUM(role.salary) AS Total_Department_Budget FROM (employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id) WHERE department.id = ? GROUP BY department', [deptId])
    }

    createEmployee(emp) {
        if (emp.empMgr === -1) {
            return query('INSERT INTO employee SET ?', { first_name: emp.empFirst, last_name: emp.empLast, role_id: emp.empRole })
        } else {
            return query('INSERT INTO employee SET ?', { first_name: emp.empFirst, last_name: emp.empLast, role_id: emp.empRole, manager_id: emp.empMgr })
        }

    }

    createDepartment(dept) {
        return query('INSERT INTO department SET ?', { name: dept.deptName })
    }

    createRole(role) {
        return query('INSERT INTO role SET ?', { title: role.roleTitle, salary: role.roleSalary, department_id: role.roleDept })
    }

    updateEmpRole(roleId, empId) {
        return query('UPDATE employee SET ? WHERE ?', [
            {
                role_id: roleId
            },
            {
                id: empId
            }
        ])
    }

    updateEmpMgr(mgrId, empId) {
        return query('UPDATE employee SET ? WHERE ?', [
            {
                manager_id: mgrId
            },
            {
                id: empId
            }
        ])
    }

    removeEmployee(empId) {
        return query('DELETE FROM employee WHERE id = ?', empId)
    }


    removeDepartment(deptId) {
        return query('DELETE FROM department WHERE id = ?', [deptId])
    }

    removeRole(roleId) {
        return query('DELETE FROM role WHERE id = ?', [roleId])
    }

}


module.exports = EmpData;