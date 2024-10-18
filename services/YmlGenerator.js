import fs from 'fs/promises';
import path from 'path';
import {v5 as uuidv5} from 'uuid';
import xmlbuilder from 'xmlbuilder';
import {ensureExists} from '../plugins/file.js';
import {getTranslation} from '../plugins/translations.js';

const SECRET_SOL = process.env.SECRET_SOL || 'b6a9118d-d4a5-5086-91ea-07368a0ede57';


function processMapping(mapping, data) {
  const result = {};

  // Проходим по каждому ключу и обрабатываем его значение
  for (const key in mapping) {
    if (mapping.hasOwnProperty(key)) {
      const value = mapping[key];
      result[key] = replaceOrExecute(value, data);
    }
  }

  return result;
}

function replaceOrExecute(template, data) {
  return template.replace(/\$\{(.*?)\}/g, (_, expression) => {
    try {
      // Выполняем динамическую логику
      return executeDynamicLogic(expression, data) ?? '';  // Если результат undefined, возвращаем пустую строку
    } catch (e) {
      console.error(`Error processing expression: ${expression}`, e);
      return '';  // Если ошибка, возвращаем пустую строку
    }
  });
}

function executeDynamicLogic(expression, data) {
  try {
    // Преобразуем выражение так, чтобы оно всегда начиналось с 'data.'
    const safeExpression = expression.startsWith('data.')
      ? expression
      : `data.${expression}`;

    const func = new Function('data', `return ${safeExpression};`);

    // Выполняем функцию и возвращаем результат
    return func(data);
  } catch (e) {
    console.error(`Error executing dynamic logic: ${expression}`, e);
    return undefined;
  }
}


function createReplacer(product) {
  return function (template) {
    return replaceOrExecute(template, product);
  };
}

function splitIntoBatches(arr, batchSize) {
  const batches = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    batches.push(arr.slice(i, i + batchSize));
  }
  return batches;
}

// Функция для удаления пустых тегов из XML
function removeEmptyTags(xml) {
  // Список тегов, которые не должны быть удалены, даже если они пустые
  const tagsToKeep = ['currency'];

  // Регулярное выражение для удаления пустых парных и одиночных тегов
  return xml
    .replace(/<(\w+)([^>]*)>\s*<\/\1>/g, (match, tagName) => {
      // Если тег в списке исключений, мы его оставляем
      return tagsToKeep.includes(tagName) ? match : '';
    })
    .replace(/<(\w+)([^>]*)\/>/g, (match, tagName) => {
      // Если одиночный тег в списке исключений, оставляем его
      return tagsToKeep.includes(tagName) ? match : '';
    })
    // Удаляем лишние переходы строк
    .replace(/\n\s*\n/g, '\n');
}

// Функция подстановки единиц измерения
function setUnits(value, unit) {
  return value ? value + ' ' + unit : null;
}

export default class YmlGenerator {
  constructor(products, config = {}) {
    this.products = products;
    this.outputDir = process.env.YML_FILE_DIR || './public/uploads/feeds';
    this.outputFile = process.env.YML_FILE_NAME || 'yandex_market.yml';
    this.shopName = config.shopName || "Your Shop Name";
    this.companyName = config.companyName || "Your Company Name";
    this.shopUrl = config.shopUrl || "https://your-shop-url.com";
    this.currency = config.currency || "RUB";
    this.categoryId = config.categoryId || 1;
    this.categoryName = config.categoryName || "Автотовары";
    this.mediaPath = process.env.STRAPI_API_MEDIA || "/uploads";
    this.batchSize = config.batchSize || 100;  // Размер батча
  }

  generateYml(config) {

    const {feed, mapping, units} = config;

    const root = xmlbuilder
      .create("yml_catalog", {encoding: "UTF-8"})
      .att("date", new Date().toISOString());

    const shop = root.ele("shop");
    shop.ele("name", {}, this.shopName);
    shop.ele("company", {}, this.companyName);
    shop.ele("url", {}, this.shopUrl);

    const currencies = shop.ele("currencies");
    currencies.ele("currency", {id: this.currency, rate: 1});

    // Map для уникальных категорий
    const categoriesMap = new Map();

    const offers = shop.ele("offers");

    // Разбиваем продукты на батчи
    const productBatches = splitIntoBatches(this.products, this.batchSize);

    // Асинхронная обработка каждого батча
    for (const batch of productBatches) {
      console.log(`Processing batch of ${batch.length} products...`);

      batch.forEach((product) => {
        // Обработка динамических шаблонов с выражениями
        processMapping(mapping, product);

        // Создаем функцию для замены с конкретным product
        const replacer = createReplacer(product);

        // Список констант на основе параметров
        const stableUUID = uuidv5(replacer(mapping.id).toString(), SECRET_SOL);
        const available = replacer(mapping.available);
        const price = replacer(mapping.price);
        const productUrl = replacer(mapping.url);
        const categoryId = replacer(mapping.categoryId);
        const categoryName = replacer(mapping.categoryName);
        const name = replacer(mapping.name);
        const description = replacer(mapping.description);
        const manufacturerWarranty = replacer(mapping.manufacturerWarranty);
        const countryOfOrigin = replacer(mapping.countryOfOrigin);
        const picture = replacer(mapping.picture);
        const gallery = product?.attributes?.[mapping.gallery];
        const vendor = replacer(mapping.vendor);
        const mark = replacer(mapping.mark);
        const model = replacer(mapping.model);
        const year = replacer(mapping.year);
        const type = replacer(mapping.type);
        const bodyType = replacer(mapping.bodyType);
        const color = replacer(mapping.color);
        const engineType = replacer(mapping.engineType);
        const transmission = replacer(mapping.transmission);
        const drive = replacer(mapping.drive);
        const horsePowers = replacer(mapping.horsePowers);
        const engineCapacity = replacer(mapping.engineCapacity);
        const mileage = replacer(mapping.mileage);
        const numberOfDoors = replacer(mapping.numberOfDoors);
        const numberOfSeats = replacer(mapping.numberOfSeats);
        const fuelType = replacer(mapping.fuelType);
        const fuelConsumption = replacer(mapping.fuelConsumption);
        const condition = replacer(mapping.condition);
        const ownerCount = replacer(mapping.ownerCount);
        const customsCleared = replacer(mapping.customsCleared);
        const vin = replacer(mapping.vin);
        const dealer = replacer(mapping.dealer);
        const equipmentType = replacer(mapping.equipmentType);
        const weight = replacer(mapping.weight);
        const maxLoadCapacity = replacer(mapping.maxLoadCapacity);
        const enginePower = replacer(mapping.enginePower);
        const engineModel = replacer(mapping.engineModel);
        const fuelTankCapacity = replacer(mapping.fuelTankCapacity);
        const operatingHours = replacer(mapping.operatingHours);
        const length = replacer(mapping.length);
        const width = replacer(mapping.width);
        const height = replacer(mapping.height);

        if (categoryId && categoryName) {
          // Добавляем категорию в Map для уникальности
          if (!categoriesMap.has(categoryId)) {
            categoriesMap.set(categoryId, categoryName);
          }
        }

        const offer = offers.ele("offer", {
          id: stableUUID,
          available
        });

        offer.ele("url", {}, `${this.shopUrl}${productUrl}`);
        offer.ele("price", {}, price);
        offer.ele("currencyId", {}, this.currency);
        offer.ele("categoryId", {}, categoryId);
        offer.ele("name", {}, name);
        offer.ele("description", {}, description);
        offer.ele("manufacturer_warranty", {}, manufacturerWarranty);
        offer.ele("country_of_origin", {}, countryOfOrigin);

        // Добавляем изображения
        if (picture) {
          offer.ele("picture", {}, `${this.mediaPath}${picture}`);
        }

        if (gallery && gallery?.data?.length) {
          gallery?.data?.forEach((image) => {
            offer.ele("picture", {}, `${this.mediaPath}${image?.attributes?.url}`);
          });
        }

        if (feed === 'automobile' || feed === 'special-equipment') {
          // Automobile Fields
          offer.ele("vendor", {}, vendor);
          offer.ele("mark", {}, mark);
          offer.ele("model", {}, model);
          offer.ele("year", {}, year);
          offer.ele("type", {}, getTranslation(type, 'types'));
          offer.ele("body_type", {}, getTranslation(bodyType, 'body_type'));
          offer.ele("color", {}, getTranslation(color, 'colors'));
          offer.ele("engine_type", {}, getTranslation(engineType, 'engine_type'));
          offer.ele("transmission", {}, getTranslation(transmission, 'transmission'));
          offer.ele("drive", {}, getTranslation(drive, 'drive'));
          offer.ele("horsepower", {}, setUnits(horsePowers, (units?.horsePower || 'л.с.')));
          offer.ele("engine_capacity", {}, setUnits(engineCapacity, (units?.engineCapacity || 'литров')));
          offer.ele("mileage", {}, setUnits(mileage, (units?.mileage || 'км')));
          offer.ele("number_of_doors", {}, numberOfDoors);
          offer.ele("number_of_seats", {}, numberOfSeats);
          offer.ele("fuel_type", {}, getTranslation(fuelType, 'fuel_type'));
          offer.ele("fuel_consumption", {}, fuelConsumption);
          offer.ele("condition", {}, getTranslation(condition, 'condition'));
          offer.ele("owner_count", {}, ownerCount);
          offer.ele("customs_cleared", {}, customsCleared && 'Да');
          offer.ele("vin", {}, vin);
          offer.ele("dealer", {}, dealer && 'Официальный дилер');
        }

        if (feed === 'special-equipment') {
          // Special Equipment Fields
          offer.ele("equipment_type", {}, getTranslation(equipmentType, 'equipment_type'));
          offer.ele("weight", {}, setUnits(weight, (units?.weight || 'кг')));
          offer.ele("max_load_capacity", {}, setUnits(maxLoadCapacity, (units?.maxLoadCapacity || 'кг')));
          offer.ele("engine_power", {}, setUnits(enginePower, (units?.enginePower || 'кВт')));
          offer.ele("engine_model", {}, engineModel);
          offer.ele("fuel_tank_capacity", {}, setUnits(fuelTankCapacity, (units?.fuelTankCapacity || 'литров')));
          offer.ele("operating_hours", {}, operatingHours);

          if (length && width && height) {
            offer.ele("dimensions", {}, `${length}x${width}x${height} ${units?.dimensions || 'м'}`);
          }
        }

      })
    }

    // Создаем секцию categories после того, как все категории собраны
    const categories = shop.ele("categories");
    categoriesMap.forEach((categoryName, categoryId) => {
      categories.ele("category", {id: categoryId}, categoryName);
    });

    // Завершаем создание XML
    let xmlContent = root.end({pretty: true});

    // Удаляем пустые теги
    xmlContent = removeEmptyTags(xmlContent);

    return xmlContent;
  }

  async saveYmlFile(content) {
    try {
      const filePath = path.join(this.outputDir, this.outputFile);
      await ensureExists(this.outputDir); // Убедимся, что путь существует
      await fs.writeFile(filePath, content, 'utf8');
      console.log("YML file saved to", filePath);
    } catch (err) {
      console.error("Failed to save YML file:", err);
      throw new Error("Error saving YML file.");
    }
  }
}
