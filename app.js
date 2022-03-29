// Requiring necessary Modules

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const https = require("https");

app.get("/", function (req, res) {
  // res.send("Server is up ")
  res.sendFile(__dirname + "/index.html");
});

// Fetch Data
// WALLET ADDR : 0x60795390f5393e5641fE8F04099632A884168719
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
          res.send(userData);
          //   res.send(userData[0].stats);
          //   0.stats.thirty_day_sales

          //   const thirty_day_sales = userData[0].stats.thirty_day_sales;
          //   const name = userData[0].name;

          //   res.send(userData[0].name);
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
