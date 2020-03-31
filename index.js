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
    password: "",
    database: "employees_DB"
  });

  connection.connect(function(err) {
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
    .then (function(answer){
      switch (answer.start) {
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "View Department":
          viewDepartment()
          break;
        case "View Roll":
          viewRoll();
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

