// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
//require("console.table");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "pwnage123",
  database: "bamazon"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "choice",
        message: "Do you want to view our products?"
      }
    ])
    .then(val => {
      displayAllAvailableItems();
    });

  //getProducts();
});

var howMany = "";
var id = "";
function getProducts() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase?",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(val => {
      howManyToBuy(val.choice);
      //   console.log(val.choice);
      //   //   console.log(val.choice);
      //   connection.query(
      //     "SELECT * from products WHERE item_id =? ",
      //     [val.choice],
      //     function(err, res) {
      //       if (err) {
      //         console.log(err);
      //       }
      //       console.log(res);
      //       console.log(res[0].stock_quantity);
      //     }
      //   );

      //   connection.query(
      //     "SELECT * from products WHERE item_id=? ",
      //     [val.choice],
      //     function(err, res) {
      //       if (err) {
      //         console.log(err);
      //       }
      //     }
      //   );
    });
}

function howManyToBuy(value) {
  var thisValue = value;
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "How many would you like to buy?",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(choice => {
      //console.log(value);
      //console.log(choice);
      connection.query(
        "SELECT * from products WHERE item_id =? ",
        [thisValue],
        function(err, res) {
          if (err) {
            console.log(err);
          }
          //console.log(res[0].stock_quantity);
          checkInventory(res, choice.choice);
        }
      );
      //   connection.query(
      //     "SELECT * from products WHERE item_id =? ",
      //     [val.choice],
      //     function(err, res) {
      //       if (err) {
      //         console.log(err);
      //       }
      //       console.log(res);
      //       console.log(res[0].stock_quantity);
      //       checkInventory(res);
      //     }
      //   );
    });
}

function checkInventory(res, quantity) {
  console.log(res[0]);
  var inventory = res[0].stock_quantity;
  var productName = res[0].product_name;
  console.log("My inventory " + inventory);
  if (inventory == 0) {
    console.log("This is zero");
  } else {
    inventory = inventory - quantity;
    console.log(inventory);
    connection.query(
      "UPDATE products SET stock_quantity = ?  WHERE item_id = ?",
      [inventory, res[0].item_id],
      function(err, res) {
        if (err) {
          console.log(err);
        }
        console.log("You have purchased " + quantity + " of a " + productName);
        // console.log("")
        // Let the user know the purchase was successful, re-run loadProducts
        // console.log(
        //   "\nSuccessfully purchased " +
        //     quantity +
        //     " " +
        //     res[0].product_name +
        //     "'s!"
        // );
        //loadProducts();
      }
    );
  }
  //var inventory = res
  //if(inventory == 0)
}

function displayAllAvailableItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log(res);
    getProducts();
  });
}
// connection.query(
//   "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
//   [quantity, product.item_id],
//   function(err, res) {
//     // Let the user know the purchase was successful, re-run loadProducts
//     console.log(
//       "\nSuccessfully purchased " +
//         quantity +
//         " " +
//         product.product_name +
//         "'s!"
//     );
//     loadProducts();
//   }
// );
