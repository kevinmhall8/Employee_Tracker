const inquirer = require("inquirer");
const mysql = require("mysql");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "hall3349",
  database: "employees_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  start()
})

function start() {
  inquirer
    .prompt({
      name: "start",
      type: "list",
      message: "What Would you like to do?",
      choices: ["Add Department",
        "Add Role",
        "Add Employee",
        "View Department",
        "View Roll",
        "View Employee",
        "Update Roll",
        "Finished"
      ]
    })
    .then(function (answer) {
      switch (answer.start) {
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "View Department":
          viewDepartment()
          break;
        case "View Role":
          viewRole();
          break;
        case "View Employee":
          viewEmployee();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Finished":
          connection.end();
          process.exit();
      }
    })
}

function addDepartment() {
  inquirer
    .prompt({
      name: "department_name",
      type: "input",
      message: "What is the Department name?"
    })
    .then(function (answer) {
      var departmentName = answer.department_name;
      console.log("Adding Deparment.../n");
      var query = conncetion.query("INSERT INTO department_table SET ?",
        {
          name: departmentName
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "department added.\n")
        })
      console.log(query.sql);
    })
    .then(function () {
      start();
    })
};

function addRole() {
  inquirer
    .prompt([{
      name: "role_title",
      type: "input",
      message: "What is the title of this role?"
    },
    {
      name: "role_salary",
      type: "input",
      message: "What is the salary for this role?"
    },
    {
      name: "department_id",
      type: "input",
      message: "What is the deparment ID for this role?"
    }
    ])
    .then(function (answer) {
      console.log("Adding Role...\n")
      var query = conncetion.query("INSERT INTO role_table SET ?",
        {
          title: answer.role_title,
          salary: answer.role_salary,
          deparment_id: answer.department_id
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "role added.\n")
        })
      console.log(query.sql)
    })
    .then(function () {
      start();
    })
}

function addEmployee() {
  inquirer.prompt([{
    name: "employee_first",
    type: "input",
    message: "What is the employee's first name?"
  },
  {
    name: "employee_last",
    type: "input",
    message: "What is the employee's last name?"
  },
  {
    name: "role_id",
    type: "input",
    message: "What is the employee's manager ID?"
  },
  {
    name: "manager_id",
    type: "input",
    message: "What is the employee's manager ID?"
  }])
    .then(function (answer) {
      console.log("Adding a new role...\n");
      var query = connection.query(
        "INSERT INTO employee_table SET ?",
        {
          first_name: answer.employee_first,
          last_name: answer.employee_last,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee added.\n")
        }
      )
      console.log(query.sql);
    })
    .then(function () {
      start();
    })
}

function viewDepartment() {
  inquirer
    .prompt({
      name: "selected_department",
      type: "input",
      message: "Select the department to view employee list"
    })
    .then(function (answer) {
      var query =
        `SELECT employee_table.employee_first, employee_table.employee_last, employee_table.role_id, employee_table.manager_id FROM employee_table INNER JOIN role_table ON (employee_table.role_id = role_table.id) WHERE (employee_table.role_id = ${answer.selected_department})`
      connection.query(query, function (err, res) {
        if (err) {
          throw err;
        }
        console.table(res);
        start();
      })
    })
}

function viewRole() {
  var query = `SELECT * FROM role`;
  connection.query(query, function(err, res) {
    if (err) {
      throw err;
    }
    console.table(res);
    start();
  });
}

function viewEmployee() {
  var query = `SELECT * FROM employee`;
  connection.query(query, function(err, res) {
    if (err) {
      throw err;
    }
    console.table(res);
    start();
  });
}
