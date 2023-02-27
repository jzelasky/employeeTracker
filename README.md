# Employee Tracker

## Description

Businesses need an simple way to organize their employee data. This CLI program allows you to store employee's names, roles, salaries, and departments and view that information in different formats such as viewing employees by department.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Questions](#questions)

## Installation

Note: To install this program you must already have node.js and mysql installed on your device.

1. Download this repository on your local device.

2. Open the `employeeTracker` directory in your console.

3. Run the command `npm i`.

4. Open the mysql shell by running `mysql -u "your username" -p` and entering your mysql password.

5. Run `SOURCE db/schema.sql;`.

6. If you want seed data to get started, run `SOURCE db/seeds.sql;`, this is optional.

7. Exit the mysql shell by running `quit`. You are now ready to begin using the application.

## Usage

After installtion, make sure you are in the `employeeTracker` directory. Run `node index.js` to open the application. You will be presented with a menu with options to view, add, update, and delete records. When you are finished either choose the `Exit` menu option or type `control + C`. 

Click [here](https://drive.google.com/file/d/1avumpGlGxNCydqaDiGRB66aYbROlARfm/view) for a video walkthrough of the application.

## Questions

For any questions about this project please contact:

github.com/jzelasky

jzelasky@gmail.com