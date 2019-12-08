//Defining the npm packages to load
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");


//creating the connection
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root123",
    database: "bamazon"
  });


connection.connect(function(err) {
if (err) throw err;
mainUserface();
});


//Here we create the main interaction userface for the manager
function mainUserface (){

    //first we query the user on what action they'd wish to perform
    console.log("=========================");
    console.log("Welcome to Bamazon Manager!");
    console.log("=========================");

    //inquirer prompt here
    inquirer
    .prompt({
        name: "operation",
        type: "list",
        message: "Please enter the action you wish to perform. Use the arrows.",
        choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product", "Exit"]
      })
    .then(function(userInput) {
    //now making a switch / case structure here

        switch (userInput.operation){
            case "View Products for Sale":
                viewProducts();
                break
            case "View Low Inventory":  
                viewLowInventory();
                break;  
            case "Add to Inventory":
                addToInventory();
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                connection.end();

        }    

    });

}

//View products function
function viewProducts() {

    //first we need to read from the database and store the data locally
    var t = new Table;

    //I will be reusing the code from Bamazon Customer here
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        t.cell('Product Id', res[i].item_id);
        t.cell('Description', res[i].product_name);
        t.cell('Department', res[i].department_name);
        t.cell('Price, USD', res[i].price);
        t.cell('Quantity', res[i].stock_quantity);
        t.newRow();
      }
      
      //then we need to print to the screen.
      console.log(t.toString());

      //and return to main userface
      mainUserface();
  
    });  
}

function viewLowInventory() {
    console.log("View low inventory function");
}

function addToInventory() {
    console.log("Add to Inventory function");
}

function addNewProduct() {
    console.log("Add new product function");
}