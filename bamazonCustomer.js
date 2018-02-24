var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "ChanceDog945",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayItems();
  purchaseRequest();
});

function displayItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("\n-----------------------------------\n");
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
    }
    console.log("-----------------------------------");
  });
}

function purchaseRequest() {
  inquirer
  .prompt([
    {
      name: "itemID",
      type: "input",
      message: "What is the ID number of the item you would like to buy?"
    },
    {
      name: "unitRequest",
      type: "input",
      message: "How many units of this product would you like to purchase?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ])
  .then(function(answer) {
    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: answer.itemID }, function(err, res) {
      if (err) throw err;

      var newStockQuantity = res[0].stock_quantity - parseInt(answer.unitRequest);
      var selectedItemID = answer.itemID;
      var orderPrice = res[0].price * answer.unitRequest
      // determine if there is enough product inventory to cover requested units
      if (res[0].stock_quantity > parseInt(answer.unitRequest)) {
        //in this case, there is enough inventory, so we'll update the db, let the user know, and start over
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newStockQuantity
            },
            {
              Item_id: selectedItemID
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("Order placed successfully! The total price of this order is: " + orderPrice);
            displayItems();
            purchaseRequest();
          }
        );
      }
      else {
        // if requested quantity is too high, inform user and start over
        console.log("I'm afraid that the requested number of units is not in stock. Try again...");
        displayItems();
        purchaseRequest();
      }
    });
  });
}
