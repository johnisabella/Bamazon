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
  managerPrompt();
});

function managerPrompt() {
  inquirer
  .prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product"
    ]
  })
  .then(function(answer) {
    switch (answer.action) {
      case "View Products for Sale":
      readProducts();
      break;

      case "View Low Inventory":
      lowInventoryList();
      break;

      case "Add to Inventory":
      addInventory();
      break;

      case "Add New Product":
      addProduct();
      break;
    }
  });
}

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
    }
    managerPrompt();
  });
}

function lowInventoryList() {
  console.log("Selecting all products with less an inventory less than five units...\n");
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
    }
    managerPrompt();
  });
}

function addInventory() {
  inquirer
  .prompt([
    {
      name: "itemNumber",
      type: "input",
      message: "What is the item number of the product for which you are adding inventory?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "itemQuantity",
      type: "input",
      message: "How many items would you like to add?",
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
    connection.query(query, { item_id: answer.itemNumber }, function(err, res) {
      if (err) throw err;

      var newTotalStock = res[0].stock_quantity + parseInt(answer.itemQuantity);
      var selectedItemID = answer.itemNumber;
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: newTotalStock
          },
          {
            Item_id: selectedItemID
          }
        ],
        function(error) {
          if (error) throw err;
          console.log("Inventory added successfully! Item #" + selectedItemID + " now has " + newTotalStock + " units.");
          managerPrompt();
        }
      );
    });
  });
}

function addProduct() {
  inquirer
  .prompt([
    {
      name: "productName",
      type: "input",
      message: "What is the name of the product you would like to add?"
    },
    {
      name: "departmentName",
      type: "input",
      message: "What is the name of this product's department?"
    },
    {
      name: "price",
      type: "input",
      message: "What is the per unit price of this product?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "stockQuantity",
      type: "input",
      message: "How many units of this product are in stock?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ])
  .then(function(answer) {
    // when finished prompting, insert a new item into the db with that info
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.productName,
        department_name: answer.departmentName,
        price: answer.price,
        stock_quantity: answer.stockQuantity
      },
      function(err) {
        if (err) throw err;
        console.log("Your product was added successfully!");
        // re-prompt the user for if they want to bid or post
        managerPrompt();
      }
    );
  });
}
