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
const table = console.table


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
                choices: ['View all departments','View all roles','View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
            }
        ])
        .then((ans) => {
            if(String(ans.menu) === 'View all departments'){
                viewDepartments();
            }
            if(String(ans.menu) === 'View all roles'){
                viewRoles();
            }
            if(String(ans.menu) === 'View all employees'){
                viewEmployees();
            }
            if(String(ans.menu) === 'Add a department'){
                addDepartment();
            }
            if(String(ans.menu) === 'Add a role'){
                addRole();
            }
            if(String(ans.menu) === 'Add an employee'){
                addEmployee();
            }
            if(String(ans.menu) === 'Update an employee role'){
                updateRole();
            }
            if(String(ans.menu) === 'Exit'){
                process.exit();
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
        'SELECT * FROM role',
        function(err, results) {
          table(results);
          mainMenu();
        }
      );
}

function viewEmployees(){
    db.query(
        'SELECT * FROM employee',
        function(err, results) {
          table(results);
          mainMenu();
        }
      );
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
                              log(`${ans.name} department added`)
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

init();

