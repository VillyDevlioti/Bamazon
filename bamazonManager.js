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
                addToInventoryPrompt();
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
        if (err) throw err;
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
        if (err) throw err;
        //console.log(res);

        //calling the display function
        displayProducts(res);

      });
      
}

function addToInventoryPrompt() {

    //The first question gets the product ID
    //The second question gets the quantity
    //I will implement these to two functions separately, so that I can reuse them in the addNewProduct section

    //First we get the ID and the quantity from the user
    inquirer
    .prompt([
        {
        name: "productID",
        type: "number",
        message: "Please enter the product ID you wish to update.",
      },
      {
          name: "quantity",
          type: "number",
          message: "Please enter the quantity you'd like to add"
      }
    ])
    .then(function(userInput) {

        //first we create the query, where we search for the product with the specific ID
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {item_id: userInput.productID}, function(err, res) {
        if (err) throw err;
        console.log(res);
        console.log();
        console.log();

        //We create a variable to store the updated quantity
        //now we to calculate the updated quantity which is the old one + the new
        var updatedQuantity = res[0].stock_quantity + userInput.quantity;
        console.log("Updated Quantity", updatedQuantity);
        
        //now calling the add to Inventory function
        addToInventory(res[0].item_id, updatedQuantity);
        });
    });
}

function addToInventory(id, quantity) {
    
    //we create the query to update the quantity
    var query = "UPDATE products SET stock_quantity=? WHERE ?";
    connection.query(query, [quantity, {item_id: id}], function (err, res){
        if (err) throw err;
        //console.log(res);
        console.log();
        console.log("Updated Product quantity!");

    });

    //now let's display the updated products altogether
    viewProducts();
}

function addNewProduct() {
    //console.log("Add new product function");
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