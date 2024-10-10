import axios from "axios";

export default class ProductService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = null;
    this.cacheDuration = 1000 * 60 * 5; // 5 минут
    this.lastFetchTime = null;
  }

  async fetchProducts() {
    try {
      // Если кэшированное время еще актуально, возвращаем кэш
      if (this.cache && (Date.now() - this.lastFetchTime) < this.cacheDuration) {
        console.log("Returning cached products");
        return this.cache;
      }

      // Запрос к API
      const response = await axios.get(`${this.apiUrl}/products`);
      const products = response.data.data;

      // Обновляем кэш
      this.cache = products;
      this.lastFetchTime = Date.now();

      return products;
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response.data);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Error fetching products:", error.message);
      }
      throw error;
    }
  }
}
