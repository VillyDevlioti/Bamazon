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

//creating the main userface
function mainUserface() {
    //first we display the products
    console.log("=========================");
    console.log("Welcome to Bamazon!");
    console.log("These are our products");
    console.log("=========================");

    //calling the function to display products
    displayProducts();
  
  }

//This function displays all products in inventory
function displayProducts() {

  //first we need to read from the database and store the data locally
  var t = new Table;
  
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

    //now send the user to the prompts section
    displayChoices();
  });    

}

//This function asks the user for the product ID
function displayChoices () {
  
  //The first message should ask them the ID of the product they would like to buy.
  inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: "Please enter the ID of the product you'd like to buy",
      }, 
      {
        name: "quantity",
        type: "integer",
        message: "Please enter quantity",
      }
    ])
      .then(function(userInput) {

        //now send the user the shop or not to shop
        toShopOrNotToShop(userInput.productID, userInput.quantity);

      });
}


//This functions calculates if shopping is possible based on quantity and proceeds with the transaction
function toShopOrNotToShop(productID, quantity) {
  
  //first we check the database for sufficient quantity
  var query = "SELECT * FROM products WHERE ?";
  connection.query(query, {item_id: productID}, function(err, res) {
  
    //first we check whether we have enough stock
    if (res[0].stock_quantity < quantity) {
      console.log(res[0].stock_quantity)
      console.log("Insufficient quantity!");
      console.log("Please select another item");

      //redirecting to the main interface
      mainUserface();
    }

    //if we have sufficient quantity, then we can shop! Woohoo!
    else {

      //this is the updated quantity
      var newQuantity = res[0].stock_quantity - quantity; 

      //and we pass it to the next function
      console.log(newQuantity);
      goShopping(res[0].item_id, newQuantity, quantity);
    }
  
  }); 
}

//Here we do the actual shopping
function goShopping(id, newQuantity, quantity) {
  
  console.log("Performing your transaction...\n");

  //first we show the cost
  var query = "SELECT * FROM products WHERE ?";
  connection.query(query, {item_id: id}, function(err, res) {
    if (err) throw err;
    //console.log(res);
    console.log("You will be charged", (parseFloat(res[0].price) * quantity), "dollars")
  
  });  

  //then we update the database
  var query = "UPDATE products SET ? WHERE ?";

  connection.query(query, [{stock_quantity: newQuantity}, {item_id: id}], function(err, res) {
    if (err) throw err;
    //console.log(res);
  
    console.log("Transaction Completed");
    console.log("Thank you for shopping with us!");
    console.log();
    console.log();
    console.log();
    
    //I choose to end the connection here
    connection.end();

    //but if we uncomment we return to the main interface
    //mainUserface();
  
  });  

}
