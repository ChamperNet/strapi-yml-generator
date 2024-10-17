import axios from "axios";

export default class ProductService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = null;
    this.cacheDuration = 1000 * 60 * 15; // 15 минут
    this.lastFetchTime = null;
  }

  // Функция для выполнения одного запроса с учетом пагинации
  async fetchPage(page, pageSize, fields, populate) {
    try {
      console.log(`Loading page ${page} with page size ${pageSize}...`);
      const response = await axios.get(`${this.apiUrl}/products`, {
        params: {
          fields,
          populate,
          "pagination[page]": page,         // номер страницы
          "pagination[pageSize]": pageSize, // количество товаров на странице
        }
      });
      return response.data;
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

  // Функция для выполнения нескольких запросов с пагинацией
  async fetchAllProducts(pageSize = 10, fields, populate) {
    try {
      // Если кэш еще актуален, возвращаем кэшированные данные
      if (this.cache && (Date.now() - this.lastFetchTime) < this.cacheDuration) {
        console.log("Returning cached products");
        return this.cache;
      }

      let allProducts = [];
      let currentPage = 1;
      let totalProducts = 0;

      // Получаем первую страницу для определения общего количества товаров
      const firstPageResponse = await this.fetchPage(currentPage, pageSize, fields, populate);

      // Проверяем, что в ответе есть данные и мета-данные
      const firstPageProducts = firstPageResponse?.data || [];
      const pagination = firstPageResponse?.meta?.pagination;

      // Если данные отсутствуют, возвращаем пустой массив
      if (!pagination) {
        console.error("No pagination data found");
        return [];
      }

      // Добавляем товары с первой страницы
      allProducts = allProducts.concat(firstPageProducts);

      // Получаем общее количество товаров
      totalProducts = pagination.total;

      // Цикл для выполнения последующих запросов по 10 товаров на страницу
      const totalPages = pagination.pageCount;

      for (currentPage = 2; currentPage <= totalPages; currentPage++) {
        const pageResponse = await this.fetchPage(currentPage, pageSize, fields, populate);
        const pageProducts = pageResponse?.data || [];
        allProducts = allProducts.concat(pageProducts);
      }

      // Обновляем кэш и время последнего запроса
      this.cache = allProducts;
      this.lastFetchTime = Date.now();

      return allProducts;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }
}
