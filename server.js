require("dotenv").config();

import { config } from 'dotenv'

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const ProductService = require("./services/ProductService");
const YmlGenerator = require("./services/YmlGenerator");
const YandexController = require("./controllers/YandexController");

// Load environment variables from the .env file
config()

// Get the current working directory
const cwd = process.cwd()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(
    cors({
      origin: [
        "https://www." + process.env.DOMAIN,
        "https://" + process.env.DOMAIN,
        process.env.IP_ADDRESS,
        "http://localhost:3000",
      ],
    })
);

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With, *"
  );
  next();
});

app.use("/public", express.static("public"));

/* YML generation for Yandex Products */
const productService = new ProductService("https://your-strapi-domain/api");
const ymlGenerator = new YmlGenerator([], "yandex_market.yml");
const yandexController = new YandexController(productService, ymlGenerator);

app.post("/yandex/yml-generate", (req, res) =>
    yandexController.generateYml(req, res)
);

app.get("/", (req, res) => {
  res.send("YML creating is not allowed on GET-request");
});

app.listen(PORT, () => {
  console.log(`Server has been started and listening on port ${PORT}`);
});
