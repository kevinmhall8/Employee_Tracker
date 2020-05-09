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
  database: "employees_db"
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
        "View Role",
        "View Employee",
        "Update Employee Role",
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
        case "Update Employee Role":
          updateRole();
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
      var query = connection.query("INSERT INTO department_table SET ?",
        {
          name: departmentName
        },
        function (err, res) {
          if (err) throw err;
          console.log(" Department added.\n")
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
      var query = connection.query("INSERT INTO role_table SET ?",
        {
          title: answer.role_title,
          salary: answer.role_salary,
          department_id: answer.department_id
        },
        function (err, res) {
          if (err) throw err;
          console.log("role added.\n")
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
    message: "What is the employee's role ID?"
  },
  {
    name: "manager_id",
    type: "input",
    message: "What is the employee's manager ID?"
  }])
    .then(function (answer) {
      console.log("Adding a new employee...\n");
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
          console.log("Employee added.\n")
        }
      )
      console.log(query.sql);
    })
    .then(function () {
      start();
    })
}

function viewDepartment() {
  var query = `SELECT * FROM department_table`
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewRole() {
  var query = `SELECT * FROM role_table`;
  connection.query(query, function(err, res) {
    if (err) {
      throw err;
    }
    console.table(res);
    start();
  });
}

function viewEmployee() {
  var query = `SELECT * FROM employee_table`;
  connection.query(query, function(err, res) {
    if (err) {
      throw err;
    }
    console.table(res);
    start();
  });
}

function updateRole() {
  connection.query("SELECT employee_table.id, employee_table.first_name, employee_table.last_name FROM employee_table", 
  function(err, res) {
    var empChoices = res.map(({ id, first_name, last_name }) => ({ value: id, name: `${first_name} ${last_name}` }));
  connection.query("SELECT id, title FROM role_table", 
  function(err, results) {
    var roleChoices = results.map(({ id, title }) => ({
      value: id,
      name: title
    }));
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to adjust the role for?",
          choices: empChoices
        },
        {
          name: "new_role",
          type: "list",
          message: "What is their updated role?",
          choices: roleChoices
        }
      ])
      .then(function(answer) {
        connection.query(
          "UPDATE employee_table SET role_id = ? WHERE id = ?",
          [answer.employee, answer.new_role],
          function(err) {
            if (err) throw err;
            console.log("Employee's role has been updated");
            start();
          }
        );
      });
  });
  });
}