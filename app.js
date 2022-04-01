// Requiring necessary Modules

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// to set our apps view engine to ejs.
app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// to acess css.
app.use(express.static("public"));

const https = require("https");

var tableArr = [];

//Initializing Sorting Boolean Variable

var nameBool = false;
var salesBool = false;
var priceBool = false;

app.get("/", function (req, res) {
  // res.send("Server is up ")
  res.sendFile(__dirname + "/index.html");
  res.render("table");
});

// Fetch Data

/* 

Try Following WALLET ADDR => 
-  0x495f947276749Ce646f68AC8c248420045cb7b5e, 
-  0x60795390f5393e5641fE8F04099632A884168719 

*/

app.post("/", function (req, res) {
  const walletAddress = req.body.walletAdressInput;

  https
    .get(
      "https://api.opensea.io/api/v1/collections?asset_owner=" +
        walletAddress +
        "&offset=0&limit=300",
      (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          const userData = JSON.parse(data);
          //   res.send(userData);
          //   console.log(userData[0].stats.thirty_day_sales);

          var infoTable = new Array();

          //   const tableData = {
          //     name: userData[0].name,
          //     thirty_day_sales: userData[0].stats.thirty_day_sales,
          //     thirty_day_average_price:
          //       userData[0].stats.thirty_day_average_price,
          //     external_url: userData[0].external_url,
          //     };

          for (let i = 0; i < userData.length; i++) {
            infoTable.push({
              name: userData[i].name,
              thirty_day_sales: userData[i].stats.thirty_day_sales,
              thirty_day_average_price:
                userData[i].stats.thirty_day_average_price,
              external_url: userData[i].external_url,
            });
          }

          tableArr = infoTable;
          var dataObjects = { id1: "names", id2: "sales", id3: "price" };

          // reset the booleans
          nameBool = false;
          salesBool = false;
          priceBool = false;

          // console.log(tableArr);
          //   res.send(infoTable);
          res.render("showTable", {
            dataArray: infoTable,
          });
        });
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

app.get("/sortName", function (req, res) {
  if (nameBool == false) {
    var sortedStrings = tableArr.sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    nameBool = true;
    res.render("showTable", { dataArray: sortedStrings });
  } else {
    var sortedStrings = tableArr.sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa > fb) {
        return -1;
      }
      if (fa < fb) {
        return 1;
      }
      return 0;
    });
    nameBool = false;
    res.render("showTable", { dataArray: sortedStrings });
  }
});

app.get("/sortThirtyDaySales", function (req, res) {
  if (salesBool == false) {
    // Ascending order
    var sortedAscending = tableArr.sort((a, b) => {
      return a.thirty_day_sales - b.thirty_day_sales;
    });
    salesBool = true;
    res.render("showTable", { dataArray: sortedAscending });
  } else {
    // Descending Order
    var sortedDescending = tableArr.sort((a, b) => {
      return b.thirty_day_sales - a.thirty_day_sales;
    });
    salesBool = false;
    res.render("showTable", { dataArray: sortedDescending });
  }
});

app.get("/sortPrice", function (req, res) {
  if (priceBool == false) {
    // Ascending order
    var sortedAscending = tableArr.sort((a, b) => {
      return a.thirty_day_average_price - b.thirty_day_average_price;
    });
    priceBool = true;
    res.render("showTable", { dataArray: sortedAscending });
  } else {
    // Descending Order
    var sortedDescending = tableArr.sort((a, b) => {
      return b.thirty_day_average_price - a.thirty_day_average_price;
    });
    priceBool = false;
    res.render("showTable", { dataArray: sortedDescending });
  }
});

app.listen(3000, function () {
  console.log("Server started on localhost 3000,successfully");
});
