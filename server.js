import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import ProductService from './services/ProductService.js';
import YmlGenerator from './services/YmlGenerator.js';
import YandexController from './controllers/YandexController.js';

const app = express();
const PORT = process.env.PORT || 3030;

// Настройка middlewares
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

// Настройка зависимостей для YandexController
const productService = new ProductService(process.env.STRAPI_API_URL);
const config = {
  shopName: process.env.SHOP_NAME || "Your Shop Name",
  companyName: process.env.COMPANY_NAME || "Your Company Name",
  shopUrl: process.env.SHOP_URL || "https://your-shop-url.com",
  currency: process.env.CURRENCY || "RUB",
  categoryId: parseInt(process.env.CATEGORY_ID, 10) || 1,
  categoryName: process.env.CATEGORY_NAME || "Автотовары",
};
const ymlGenerator = new YmlGenerator([], process.env.YML_FILE_PATH, config);
const yandexController = new YandexController(productService, ymlGenerator);

// Маршрут для генерации YML по POST-запросу
app.post("/yandex/yml-generate", (req, res) => yandexController.generateYml(req, res));

// Защита GET-запроса
app.get("/", (req, res) => {
  res.status(405).send("YML creation is not allowed on GET-request");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
