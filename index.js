const inquirer = require("inquirer");
const mysql = require('mysql2');

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

function init (){
    log("Welcome to Employee Tracker");
    mainMenu();
}

function mainMenu(){
    /*WHEN I start the application
    THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role */
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
    /* WHEN I choose to view all departments
    THEN I am presented with a formatted table showing department names and department ids*/
    mainMenu();
}

function viewRoles(){
    /*WHEN I choose to view all roles
    THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role*/
    mainMenu();
}

function viewEmployees(){
    /*WHEN I choose to view all employees
    THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to*/
    mainMenu();
}

function addDepartment(){
    /*WHEN I choose to add a department
    THEN I am prompted to enter the name of the department and that department is added to the database*/
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter name of department:',
                name: 'name'
            }
        ])
        .then((ans) => {
            log(ans.name);
            //add to database
            mainMenu();
        })
    
}

function addRole(){
    /*WHEN I choose to add a role
    THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database*/
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
            log(ans.name + ans.salary + ans.dept);
            //add to database
            mainMenu();
        })
}

function addEmployee(){
    /*WHEN I choose to add an employee
    THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database*/
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
            log(ans.fName + ans.lName + ans.role + ans.manager);
            //add to database
            mainMenu();
        })
}

function updateRole(){
    /*WHEN I choose to update an employee role
    THEN I am prompted to select an employee to update and their new role and this information is updated in the database*/
    mainMenu();
}

init();

