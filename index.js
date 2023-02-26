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
    /*WHEN I choose to add a department
    THEN I am prompted to enter the name of the department and that department is added to the database*/
    //error if department already exists 
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter name of department:',
                name: 'name'
            }
        ])
        .then((ans) => {
           db.query(
                `INSERT INTO department (name) VALUES ("${ans.name}")`,
                function(err, results) {
                  log(`${ans.name} department added`)
                  mainMenu();
                }
              );
        })
    
}

function addRole(){
    /*WHEN I choose to add a role
    THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database*/
    //error if role already exists 
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter role name:',
                name: 'name'
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
            db.query(
                `INSERT INTO role (title, salary, department_id) VALUES ("${ans.name}", "${ans.salary}", "${ans.dept}")`,
                function(err, results) {
                  log(`${ans.name} role added to ${ans.dept} department`)
                  mainMenu();
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
                message: "Enter employee's manager:",
                name: 'manager'
            }
        ])
        .then((ans) => {
            //need to add error if the role or manager doesnt exist
            //error if employee already exists 
            //convert role name to role id and manager name to manager id
            db.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${ans.fName}", "${ans.lName}", "${ans.role}", "${ans.manager}")`,
                function(err, results) {
                  log(`${ans.fName} ${ans.lName} added`)
                  mainMenu();
                }
            );
        })
}

function updateRole(){
    /*WHEN I choose to update an employee role
    THEN I am prompted to select an employee to update and their new role and this information is updated in the database*/
    //convert role name to id
    //update in sql
    //go back to main menu

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
                        log(empId)
                        log(roleId)
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

