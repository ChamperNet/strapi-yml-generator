/*
 * Timur Iskakov (champer.ru)
 * Copyright (c) 2024.
 */
const { ensureExists } = require("../plugins/file");
const { v4: uuidv4 } = require("uuid");

class YmlGenerator {
  constructor(products, outputFilePath) {
    this.products = products;
    this.outputFilePath = outputFilePath;
  }

  generateYml() {
    const root = xmlbuilder
      .create("yml_catalog", { encoding: "UTF-8" })
      .att("date", new Date().toISOString());

    const shop = root.ele("shop");
    shop.ele("name", {}, "Your Shop Name");
    shop.ele("company", {}, "Your Company Name");
    shop.ele("url", {}, "https://your-shop-url.com");

    const currencies = shop.ele("currencies");
    currencies.ele("currency", { id: "RUB", rate: 1 });

    const categories = shop.ele("categories");
    categories.ele("category", { id: 1 }, "Автотовары");

    const offers = shop.ele("offers");

    this.products.forEach((product) => {
      const offer = offers.ele("offer", { id: uuidv4(), available: true });
      offer.ele(
        "url",
        {},
        `https://your-shop-url.com/products/${product.slug}`
      );
      offer.ele("price", {}, product.price);
      offer.ele("currencyId", {}, "RUB");
      offer.ele("categoryId", {}, 1);
      offer.ele("name", {}, product.name);
      offer.ele("description", {}, product.description);
      offer.ele("vendor", {}, product.vendor);
    });

    return root.end({ pretty: true });
  }

  saveYmlFile(content) {
    ensureExists(this.outputFilePath, (err) => {
      if (err) {
        console.error("Failed to create folder:", err);
        return res.status(500).send("Error creating folder.");
      }

      fs.writeFileSync(this.outputFilePath, content, "utf8");
      console.log("YML file saved to", this.outputFilePath);
    });
  }
}

module.exports = YmlGenerator;
