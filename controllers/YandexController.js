/*
 * Timur Iskakov (champer.ru)
 * Copyright (c) 2024.
 */

class YandexController {
  constructor(productService, ymlGenerator) {
    this.productService = productService;
    this.ymlGenerator = ymlGenerator;
  }

  async generateYml(req, res) {
    try {
      const products = await this.productService.fetchProducts();
      this.ymlGenerator.products = products; // Обновляем список продуктов в генераторе
      const ymlContent = this.ymlGenerator.generateYml();
      this.ymlGenerator.saveYmlFile(ymlContent);
      res.status(200).send("YML file generated successfully.");
    } catch (error) {
      console.error("Error generating YML file:", error);
      res.status(500).send("Error generating YML file.");
    }
  }
}

module.exports = YandexController;
