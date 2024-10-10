const { Router } = require("express");
const yandexController = require("../controllers/yandexController");

const app = Router();

app.post("/yandex/yml-generate", (req, res) =>
  yandexController.generateYml(req, res)
);
app.get("/yandex/yml-generate", (req, res) => {
  res.send("Yandex: XML creating is not allowed on GET-request");
});

module.exports = app;
