import fs from 'fs';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import xmlbuilder from 'xmlbuilder';
import {ensureExists} from '../plugins/file.js';

export default class YmlGenerator {
  constructor(products, outputFilePath, config = {}) {
    this.products = products;
    this.outputFilePath = outputFilePath;
    this.shopName = config.shopName || "Your Shop Name";
    this.companyName = config.companyName || "Your Company Name";
    this.shopUrl = config.shopUrl || "https://your-shop-url.com";
    this.currency = config.currency || "RUB";
    this.categoryId = config.categoryId || 1;
    this.categoryName = config.categoryName || "Автотовары";
  }

  generateYml() {
    const root = xmlbuilder
      .create("yml_catalog", {encoding: "UTF-8"})
      .att("date", new Date().toISOString());

    const shop = root.ele("shop");
    shop.ele("name", {}, this.shopName);
    shop.ele("company", {}, this.companyName);
    shop.ele("url", {}, this.shopUrl);

    const currencies = shop.ele("currencies");
    currencies.ele("currency", {id: this.currency, rate: 1});

    const categories = shop.ele("categories");
    categories.ele("category", {id: this.categoryId}, this.categoryName);

    const offers = shop.ele("offers");

    this.products.forEach((product) => {
      const offer = offers.ele("offer", {id: uuidv4(), available: true});
      offer.ele("url", {}, `${this.shopUrl}/products/${product.slug}`);
      offer.ele("price", {}, product.price);
      offer.ele("currencyId", {}, this.currency);
      offer.ele("categoryId", {}, this.categoryId);
      offer.ele("name", {}, product.name);
      offer.ele("description", {}, product.description);
      offer.ele("vendor", {}, product.vendor);
    });

    return root.end({pretty: true});
  }

  async saveYmlFile(content) {
    try {
      await ensureExists(this.outputFilePath); // Убедимся, что путь существует
      await fs.writeFile(this.outputFilePath, content, "utf8");
      console.log("YML file saved to", this.outputFilePath);
    } catch (err) {
      console.error("Failed to save YML file:", err);
      throw new Error("Error saving YML file.");
    }
  }
}
