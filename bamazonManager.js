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

    //I will be reusing the code from Bamazon Customer here
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        //console.log(res);

        //calling the display function
        displayProducts(res);

      });
}

function viewLowInventory() {
    console.log("View low inventory function");

    //first we create the query
    var query = "SELECT * FROM products WHERE stock_quantity <5";
    connection.query(query, function(err, res) {
        //console.log(res);

        //calling the display function
        displayProducts(res);

      });
      
}

function addToInventory() {

    //As I see it here we need two inquirer prompts. 
    //The first one will get the ID
    //The second one will get the quantity
    //I will implement these to two functions separately, so that I can reuse them in the addNewProduct section

    //First we get the ID from the user
    inquirer
    .prompt({
        name: "productID",
        type: "integer",
        message: "Please enter the product ID you wish to update.",
      })
    .then(function(userInput) {
    //now calling the 


    });
}

function addNewProduct() {
    console.log("Add new product function");
}

function displayProducts(arr) {
    
    //first we need to read from the database and store the data locally
    var table = new Table;

    for (var i = 0; i < arr.length; i++) {
        table.cell('Product Id', arr[i].item_id);
        table.cell('Description', arr[i].product_name);
        table.cell('Department', arr[i].department_name);
        table.cell('Price, USD', arr[i].price);
        table.cell('Quantity', arr[i].stock_quantity);
        table.newRow();
      }

    console.log(table.toString());

    //and return to main userface
    mainUserface();

}