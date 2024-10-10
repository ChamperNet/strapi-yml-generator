/*
 * Timur Iskakov (champer.ru)
 * Copyright (c) 2024.
 */

class ProductService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchProducts() {
    try {
      const response = await axios.get(`${this.apiUrl}/products`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
