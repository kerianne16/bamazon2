const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",
    password: "root",
    database: "bamazonDB"
});


connection.connect(function (err) {
    if (err) {
        console.log("error connecting: " + err.stack);
    }

    products();
});

function products() {
    connection.query("SELECT * FROM products", function (err) {
        if (err) throw err;

        searchProducts();
    });
}

function searchProducts() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View items for sale"
            ]

        })
        .then(function (answer) {
            switch (answer.action) {
                case "View items for sale":
                    listItems();
                    break;

                case "Search for product by name":
                    itemSearch();
                    break;

                case "Search by catergory":
                    catergorySearch();
                    break;
            }
        });
}

function listItems() {
    console.log("/n")
    const query = "SELECT item_id, product_name, department_name, price, stock_quanity FROM products";
    connection.query(query, function (err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id} Name: ${res[i].product_name} Department: ${res[i].department_name} $ ${res[i].price} In Stock: ${res[i].stock_quanity}`);
        }
        doYouWantToBuy();
    });
}

function doYouWantToBuy() {
    inquirer
        .prompt({
            name: "buy",
            type: "list",
            message: "Do you want to buy something",
            choices: [
                "Yes",
                "No"
            ]
        })
        .then(function (answer) {
            switch (answer.buy) {
                case "Yes":
                    selectProduct();
                    break;

                case "No":
                    searchProducts();
                    break;
            }
        });
}
function selectProduct() {
    inquirer
        .prompt({
            name: "itemID",
            type: "input",
            message: "Enter an Item Number"
        })
        .then(function (selection) {
            selectQuantity(selection.itemID)
        });

}
function selectQuantity(itemID) {
    inquirer
        .prompt(
            {
                name: "quantity",
                type: "input",
                message: "Enter the quantity"
            })
        .then(function (selection) {
            console.log(`you selected:  ${itemID}`)
            console.log(`quanity: ${selection.quantity}`)
            const query = "SELECT * from products where ?"
            connection.query(query, { item_id: itemID }, function (err, res) {
                let quantityAvailable = res[0].stock_quantity
                let myTotal = res[0].price * selection.quantity
                if (quantityAvailable < selection.quantity) {
                    console.log(`There are only ${quantityAvailable} units in stock`)
                    console.log("Insufficent Quantity!")
                    searchProducts()
                }
                else {
                    let amountLeft = quantityAvailable - selection.quantity
                    buySomething(itemID, amountLeft)
                    console.log("Purchase Complete!")
                    console.log(`your total cost was ${myTotal}`)
                }


            });

        });

}

function buySomething(itemID, newAmount) {
    let sql = "UPDATE products SET stock_quantity = ? WHERE item_id = ?"
    connection.query(sql, [newAmount, itemID], function (err, res) {
        if (err) throw err
        listItems()
    });
}


