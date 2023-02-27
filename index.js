const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

const log = console.log
const table = (results) => {
    log(' ');
    console.table(results);
    log(' ');
}


function init (){
    log("Welcome to Employee Tracker");
    mainMenu();
}

function mainMenu(){
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What do you want to do?',
                name: 'menu',
                choices: ['View Records', 'Add Record', 'Update Record','Delete Record','Exit']
            }
        ])
        .then((ans) => {
            if(String(ans.menu) === 'View Records'){
                viewMenu();
            }
            if(String(ans.menu) === 'Add Record'){
                addMenu();
            }
            if(String(ans.menu) === 'Update Record'){
                updateMenu();
            }
            if(String(ans.menu) === 'Delete Record'){
                deleteMenu();
            }
            if(String(ans.menu) === 'Exit'){
                process.exit();
            }
        })
}

//VIEW (SELECT) FUNCTIONS

function viewMenu(){
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What do you want to do?',
                name: 'menu',
                choices: ['View all Departments','View all Roles','View all Employees','View Employees by Manager','View Employees by Department','View Budget by Department','Go Back to Main Menu']
            }
        ])
        .then((ans) => {
            if(String(ans.menu) === 'View all Departments'){
                viewDepartments();
            }
            if(String(ans.menu) === 'View all Roles'){
                viewRoles();
            }
            if(String(ans.menu) === 'View all Employees'){
                viewEmployees();
            }
            if(String(ans.menu) === 'View Employees by Manager'){
                viewEmpsByMngr();
            }
            if(String(ans.menu) === 'View Employees by Department'){
                viewEmpsByDept();
            }
            if(String(ans.menu) === 'View Budget by Department'){
                viewBudget();
            }
            if(String(ans.menu) === 'Go Back to Main Menu'){
                mainMenu();
            }
        })
}

function viewDepartments(){
    db.query(
        'SELECT * FROM department',
        function(err, results) {
            table(results);
            mainMenu();
        }
      );
}

function viewRoles(){
    db.query(
        'SELECT role.title, role.salary, department.name FROM role LEFT JOIN department ON department.id = role.department_id',
        function(err, results) {
            table(results);
            mainMenu();
        }
      );
}

function viewEmployees(){
    db.query(
        'SELECT * FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id',
        function(err, results) {
            table(results);
            mainMenu();
        }
      );
}

function viewEmpsByMngr(){
    db.query(
        'SELECT * FROM employee ORDER BY manager_id',
        function(err, results) {
            table(results);
            mainMenu();
        }
      );
}

function viewEmpsByDept(){
    db.query(
        'SELECT employee.first_name, employee.last_name, role.title, department.name FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id ORDER BY department_id',
        function(err, results) {
            table(results);
            mainMenu();
        }
      );
}

function viewBudget(){
    db.query(
        'SELECT department.name, SUM(role.salary) AS salary_sum FROM role JOIN department ON department.id = role.department_id GROUP BY role.department_id',
        function(err, results){
            table(results);
            mainMenu();
        }
    )
}

//ADD (INSERT) FUNCTIONS

function addMenu(){
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What do you want to do?',
                name: 'menu',
                choices: ['Add Department','Add Role','Add Employee','Go Back to Main Menu']
            }
        ])
        .then((ans) => {
            if(String(ans.menu) === 'Add Department'){
                addDepartment();
            }
            if(String(ans.menu) === 'Add Role'){
                addRole();
            }
            if(String(ans.menu) === 'Add Employee'){
                addEmployee();
            }
            if(String(ans.menu) === 'Go Back to Main Menu'){
                mainMenu();
            }
        })
}

function addDepartment(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter name of department:',
                name: 'dept'
            }
        ])
        .then((ans) => {
            db.query(
                `SELECT id FROM department WHERE name = '${ans.dept}'`,
                function (err, results) {
                    if (results.length > 0){
                        log('Error: Department already exists')
                        mainMenu();
                    } else {
                        db.query(
                            `INSERT INTO department (name) VALUES ("${ans.dept}")`,
                            function(err, results) {
                              log(`Department successfully added`)
                              mainMenu();
                            }
                        );
                    }
                }
            )
        })
    
}

function addRole(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter role name:',
                name: 'role'
            },
            {
                type: 'input',
                message: 'Enter role salary:',
                name: 'salary'
            },
            {
                type: 'input',
                message: 'Enter role department:',
                name: 'dept'
            }
        ])
        .then((ans) => {
            let deptId
            db.query(
                `SELECT id FROM role WHERE title = '${ans.role}'`,
                function (err, results) {
                    if (results.length > 0){
                        log('Error: Role already exists')
                        mainMenu();
                    } else {
                        db.query(
                            `SELECT id FROM department WHERE name = '${ans.dept}'`,
                            function (err, results) {
                                if (results.length < 1){
                                    log("Error: Department doesn't exist");
                                    mainMenu();
                                } else {
                                    deptId = JSON.stringify(results[0]);
                                    deptId = deptId.slice(6, deptId.length-1)
                                    deptId = parseInt(deptId);
                                }
                                db.query(
                                    `INSERT INTO role (title, salary, department_id) VALUES ("${ans.role}", "${ans.salary}", "${deptId}")`,
                                    function(err, results) {
                                      log(`${ans.role} role successfully added`)
                                      mainMenu();
                                    }
                                  );
                            }
                        )
                    }
                }
            );
        })
}

function addEmployee(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Enter employee's first name:",
                name: 'fName'
            },
            {
                type: 'input',
                message: "Enter employee's last name:",
                name: 'lName'
            },
            {
                type: 'input',
                message: "Enter employee's role:",
                name: 'role'
            },
            {
                type: 'input',
                message: "Enter employee's manager's first name:",
                name: 'mngerFname'
            },
            {
                type: 'input',
                message: "Enter employee's manager's last name:",
                name: 'mngerLname'
            }
        ])
        .then((ans) => {
            let roleId;
            let mngrId;
            db.query(
                `SELECT id FROM employee WHERE first_name = '${ans.fName}' AND last_name = '${ans.lName}'`,
                function(err, results) {
                    if (results.length > 0){
                        log('Error: Employee already exists')
                        mainMenu();
                    } else {
                        db.query(
                            `SELECT id FROM role WHERE title = '${ans.role}'`,
                            function (err, results){
                                if (results.length < 1){
                                    log('Error: Role not found')
                                    mainMenu();
                                } else {
                                    roleId = JSON.stringify(results[0]);
                                    roleId = roleId.slice(6, roleId.length-1)
                                    roleId = parseInt(roleId);
                                }
                                db.query(
                                    `SELECT id FROM employee WHERE first_name = '${ans.mngerFname}' AND last_name = '${ans.mngerLname}'`,
                                    function (err, results){
                                        if (results.length < 1){
                                            log('Error: Manager name not found')
                                            mainMenu();
                                        } else {
                                            mngrId = JSON.stringify(results[0]);
                                            mngrId = mngrId.slice(6, mngrId.length-1)
                                            mngrId = parseInt(mngrId);
                                        }
                                        db.query(
                                            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${ans.fName}", "${ans.lName}", "${roleId}", "${mngrId}")`,
                                            function(err, results) {
                                              log("Employee successfully added")
                                              mainMenu();
                                            }
                                        );
                                    }
                                )
                            }
                        )
                    }
                }
            )
        })
}

//UPDATE FUNCTIONS

function updateMenu(){
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What do you want to do?',
                name: 'menu',
                choices: ["Update an Employee's Role","Update an Employee's Manager",'Go Back to Main Menu']
            }
        ])
        .then((ans) => {
            if(String(ans.menu) === "Update an Employee's Role"){
                updateRole();
            }
            if(String(ans.menu) === "Update an Employee's Manager"){
                updateManager();
            }
            if(String(ans.menu) === 'Go Back to Main Menu'){
                mainMenu();
            }
        })
}

function updateRole(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Enter employee's first name:",
                name: 'fName'
            },
            {
                type: 'input',
                message: "Enter employee's last name:",
                name: 'lName'
            },
            {
                type: 'input',
                message: "Enter employee's new role:",
                name: 'role'
            }
        ])
        .then((ans) => {
            let empId
            let roleId
            db.query(
                `SELECT id FROM employee WHERE first_name = '${ans.fName}' AND last_name = '${ans.lName}'`,
                function(err, results) {
                  if (results.length < 1){
                    log('Error: Employee name not found')
                    mainMenu();
                  } else {
                    empId = JSON.stringify(results[0]);
                    empId = empId.slice(6, empId.length-1)
                    empId = parseInt(empId);
                  }
                  db.query(
                    `SELECT id FROM role WHERE title = '${ans.role}'`,
                    function(err, results) {
                        if (results.length < 1){
                            log('Error: Role not found')
                            mainMenu();
                        } else {
                            roleId = JSON.stringify(results[0]);
                            roleId = roleId.slice(6, roleId.length-1)
                            roleId = parseInt(roleId);
                        }
                        db.query(
                            `UPDATE employee SET role_id = '${roleId}' WHERE id = '${empId}'`,
                            function (err, results) {
                                log('Employee role sucessfully updated');
                                mainMenu();
                            }
                        )
                    }
                  )
                }
            );
            
        })
}

function updateManager (){
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Enter employee's first name:",
                name: 'empFname'
            },
            {
                type: 'input',
                message: "Enter employee's last name:",
                name: 'empLname'
            },
            {
                type: 'input',
                message: "Enter new manager's first name:",
                name: 'mngrFname'
            },
            {
                type: 'input',
                message: "Enter new manager's last name:",
                name: 'mngrLname'
            }  
        ])
        .then((ans) => {
            ans.empFname, ans.empLname, ans.mngrFname, ans.mngrLname
            let empId
            let mngrId
            db.query(
                `SELECT id FROM employee WHERE first_name = '${ans.empFname}' AND last_name = '${ans.empLname}'`,
                function(err, results) {
                    if (results.length < 1){
                        log('Error: Employee name not found')
                        mainMenu();
                    } else {
                        empId = JSON.stringify(results[0]);
                        empId = empId.slice(6, empId.length-1)
                        empId = parseInt(empId);
                    }
                    db.query(
                        `SELECT id FROM employee WHERE first_name = '${ans.mngrFname}' AND last_name = '${ans.mngrLname}'`,
                        function(err, results) {
                            if (results.length < 1){
                                log('Error: Manager name not found')
                                mainMenu();
                            } else {
                                mngrId = JSON.stringify(results[0]);
                                mngrId = mngrId.slice(6, mngrId.length-1)
                                mngrId = parseInt(mngrId);
                            }
                            db.query(
                                `UPDATE employee SET manager_id = '${mngrId}' WHERE id = '${empId}'`,
                                function (err, results) {
                                    log("Employee's manager sucessfully updated");
                                    mainMenu();
                                }
                            )
                        }
                    )
                }
            )
        })
}

//DELETE FUNCTIONS

function deleteMenu(){
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What do you want to do?',
                name: 'menu',
                choices: ['Delete a Department','Delete a Role','Delete an Employee','Go Back to Main Menu']
            }
        ])
        .then((ans) => {
            if(String(ans.menu) === 'Delete a Department'){
                deleteDept();
            }
            if(String(ans.menu) === 'Delete a Role'){
                deleteRole();
            }
            if(String(ans.menu) === 'Delete an Employee'){
                deleteEmp();
            }
            if(String(ans.menu) === 'Go Back to Main Menu'){
                mainMenu();
            }
        })
}

function deleteDept(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter name of department to delete:',
                name: 'dept'
            }
        ])
        .then((ans) => {
            db.query(
                `SELECT id FROM department WHERE name = '${ans.dept}'`,
                function (err, results) {
                    if (results.length < 1){
                        log('Error: Department does not exists')
                        mainMenu();
                    } else {
                        db.query(
                            `DELETE FROM department WHERE department.name = '${ans.dept}'`,
                            function(err, results) {
                              log(`Department successfully deleted`)
                              mainMenu();
                            }
                        );
                    }
                }
            )
        })
}

function deleteRole(){
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter name of role to delete:',
                name: 'role'
            }
        ])
        .then((ans) => {
            db.query(
                `SELECT id FROM role WHERE title = '${ans.role}'`,
                function (err, results) {
                    if (results.length < 1){
                        log('Error: Role does not exists')
                        mainMenu();
                    } else {
                        db.query(
                            `DELETE FROM role WHERE role.title = '${ans.role}'`,
                            function(err, results) {
                              log(`Role successfully deleted`)
                              mainMenu();
                            }
                        );
                    }
                }
            )
        })
}

function deleteEmp(){
    log('hello')
    inquirer
        .prompt([
            {
                type: 'input',
                message: "Enter employee to delete's first name:",
                name: 'fName'
            },
            {
                type: 'input',
                message: "Enter employee to delete's last name:",
                name: 'lName'
            }
        ])
        .then((ans) => {
            db.query(
                `SELECT id FROM employee WHERE first_name = '${ans.fName}' AND last_name = '${ans.lName}'`,
                function (err, results) {
                    if (results.length < 1){
                        log('Error: Employee does not exists')
                        mainMenu();
                    } else {
                        let empId = JSON.stringify(results[0]);
                        empId = empId.slice(6, empId.length-1)
                        empId = parseInt(empId);
                        db.query(
                            `DELETE FROM employee WHERE employee.id = '${empId}'`,
                            function(err, results) {
                              log(`Employee successfully deleted`)
                              mainMenu();
                            }
                        );
                    }
                }
            )
        })
}


init();

