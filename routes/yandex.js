const { Router } = require("express");
const YandexController = require("../controllers/YandexController");

const app = Router();

// Создаем экземпляр контроллера
const yandexController = new YandexController();

// POST-запрос для генерации YML
app.post("/yandex/yml-generate", async (req, res) => {
  try {
    await yandexController.generateYml(req, res);
  } catch (error) {
    console.error("Error processing YML generation:", error);
    res.status(500).send("An error occurred during YML generation.");
  }
});

// Защита GET-запроса
app.get("/yandex/yml-generate", (req, res) => {
  res.status(405).send("YML creation is not allowed on GET-request");
});

module.exports = app;
