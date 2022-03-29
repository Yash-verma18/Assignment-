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

const https = require("https");

app.get("/", function (req, res) {
  // res.send("Server is up ")
  res.sendFile(__dirname + "/index.html");
  res.render("table");
});

// Fetch Data
// WALLET ADDR : 0x60795390f5393e5641fE8F04099632A884168719
// 2nd wallet addr : 0x495f947276749Ce646f68AC8c248420045cb7b5e
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

          //   res.send(infoTable);
          res.render("showTable", { dataArray: infoTable });
        });
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

app.listen(3000, function () {
  console.log("Server started successfully");
});
