/*
 * Timur Iskakov (champer.ru)
 * Copyright (c) 2024.
 */

export default class YandexController {
  constructor(productService, ymlGenerator) {
    this.productService = productService;
    this.ymlGenerator = ymlGenerator;
  }

  async generateYml(req, res) {

    // Извлекаем поля из тела запроса
    const {fields, populate, feed, mapping} = req.body;

    // Если что-то не передано, задаем значения по умолчанию
    const fieldsToFetch = fields || null;
    const populateFields = populate || null;
    const feedType = feed || 'common'
    const mappingFields = mapping

    try {
      // Получаем список товаров
      const products = await this.productService.fetchAllProducts(10, fieldsToFetch, populateFields);

      // Обновляем список продуктов в генераторе
      this.ymlGenerator.products = products;

      // Генерируем YML файл
      const ymlContent = this.ymlGenerator.generateYml(
        {
          feed: feedType,
          mapping: mappingFields,
        }
      );

      // Сохраняем YML файл асинхронно
      await this.ymlGenerator.saveYmlFile(ymlContent);

      res.status(200).send("YML file generated successfully.");
    } catch (error) {
      console.error("Error generating YML file:", error);

      // Уведомление об ошибке (например, через email или другие системы уведомлений)
      // notifyError(error); // реализация уведомления

      res.status(500).send("Error generating YML file.");
    }
  }
}
