#!/usr/bin/env node

import {Command} from 'commander';
import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';
import ProductService from './services/ProductService.js';
import YmlGenerator from './services/YmlGenerator.js';

// Получаем путь к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config({path: path.resolve(process.cwd(), '.env')});

const program = new Command();
program.version('1.0.0');

// Вспомогательная функция для создания файла
async function createFileIfNotExists(templatePath, destinationPath, content = null) {
  try {
    if (await fs.stat(destinationPath).catch(() => false)) {
      console.log(`${path.basename(destinationPath)} already exists.`);
    } else {
      if (content) {
        await fs.writeFile(destinationPath, content.trim());
      } else {
        await fs.copyFile(templatePath, destinationPath);
      }
      console.log(`${path.basename(destinationPath)} has been created.`);
    }
  } catch (error) {
    console.error(`Error creating ${path.basename(destinationPath)}:`, error);
  }
}

// Вспомогательная функция для создания директории
async function createDirectoryIfNotExists(directoryPath) {
  try {
    await fs.mkdir(directoryPath, {recursive: true});
    console.log(`${path.basename(directoryPath)} directory has been created.`);
  } catch (error) {
    console.error(`Error creating directory ${path.basename(directoryPath)}:`, error);
  }
}

// Команда init для инициализации конфигурации
program
  .command('init')
  .description('Initialize the YML generator configuration')
  .action(async () => {
    const cwd = process.cwd();
    const feedsDir = path.resolve(cwd, 'feeds');
    const templateEnvPath = path.resolve(__dirname, 'template.env');
    const destinationEnvPath = path.resolve(cwd, '.env');
    const ecosystemTemplate = path.resolve(__dirname, 'ecosystem.config.js');
    const ecosystemPath = path.resolve(cwd, 'ecosystem.config.js');
    const gitignorePath = path.resolve(cwd, '.gitignore');

    // Создаем .env файл
    await createFileIfNotExists(templateEnvPath, destinationEnvPath);

    // Создаем директорию feeds
    await createDirectoryIfNotExists(feedsDir);

    // Создаем ecosystem.config.js
    await createFileIfNotExists(ecosystemTemplate, ecosystemPath);

    // Создаем .gitignore файл
    const gitignoreContent = `
backups
backups/errors.log
backups/output.log
feeds
/*.log
.idea
node_modules
.env
/package-lock.json
    `;
    await createFileIfNotExists(null, gitignorePath, gitignoreContent);
  });

// Команда run для разовой генерации YML файла
program
  .command('run')
  .description('Run the YML generator once')
  .action(async () => {
    try {
      const productService = new ProductService(process.env.STRAPI_API_URL);
      const products = await productService.fetchProducts();

      const config = {
        shopName: process.env.SHOP_NAME || "Your Shop Name",
        companyName: process.env.COMPANY_NAME || "Your Company Name",
        shopUrl: process.env.SHOP_URL || "https://your-shop-url.com",
        currency: process.env.CURRENCY || "RUB",
        categoryId: parseInt(process.env.CATEGORY_ID, 10) || 1,
        categoryName: process.env.CATEGORY_NAME || "Автотовары",
      };

      const outputFilePath = process.env.YML_FILE_PATH || './feeds/yandex_market.yml';
      const ymlGenerator = new YmlGenerator(products, outputFilePath, config);

      const ymlContent = ymlGenerator.generateYml();
      await ymlGenerator.saveYmlFile(ymlContent);
      console.log('YML file has been generated successfully.');
    } catch (error) {
      console.error('Error during YML generation:', error);
    }
  });

program.parse(process.argv);
