import fs from 'fs/promises';
import path from 'path';
import {v5 as uuidv5} from 'uuid';
import xmlbuilder from 'xmlbuilder';
import {ensureExists} from '../plugins/file.js';
import {getTranslation} from '../plugins/translations.js';

const SECRET_SOL = process.env.SECRET_SOL || 'b6a9118d-d4a5-5086-91ea-07368a0ede57';

export default class YmlGenerator {
  constructor(products, config = {}) {
    this.products = products;
    this.outputDir = process.env.YML_FILE_DIR || './public/uploads/feeds';
    this.outputFile = process.env.YML_FILE_NAME || 'yandex_market.yml';
    this.shopName = config.shopName || 'Your Shop Name';
    this.companyName = config.companyName || 'Your Company Name';
    this.shopUrl = config.shopUrl || 'https://your-shop-url.com';
    this.currency = config.currency || 'RUB';
    this.categoryId = config.categoryId || 1;
    this.categoryName = config.categoryName || 'Автотовары';
    this.mediaPath = process.env.STRAPI_API_MEDIA || '/uploads';
    this.batchSize = config.batchSize || 100; // Размер батча
  }

  // Метод для обработки динамических выражений в JSON-массивах
  processMapping(mapping, data) {
    const result = {};
    for (const key in mapping) {
      if (mapping.hasOwnProperty(key)) {
        const value = mapping[key];
        result[key] = this.replaceOrExecute(value, data);
      }
    }
    return result;
  }

  // Метод для подмены шаблонов или выполнения логики
  replaceOrExecute(template, data) {
    return template.replace(/\$\{(.*?)\}/g, (_, expression) => {
      try {
        return this.executeDynamicLogic(expression, data) ?? ''; // Если результат undefined, возвращаем пустую строку
      } catch (e) {
        console.error(`Error processing expression: ${expression}`, e);
        return ''; // Если ошибка, возвращаем пустую строку
      }
    });
  }

  // Метод для выполнения динамической логики
  executeDynamicLogic(expression, data) {
    try {
      const safeExpression = expression.startsWith('data.')
        ? expression
        : `data.${expression}`;
      const func = new Function('data', `return ${safeExpression};`);
      return func(data);
    } catch (e) {
      console.error(`Error executing dynamic logic: ${expression}`, e);
      return undefined;
    }
  }

  // Метод для создания функции замены данных для конкретного продукта
  createReplacer(product) {
    return (template) => this.replaceOrExecute(template, product);
  }

  // Метод для разбивки массива на батчи
  splitIntoBatches(arr, batchSize) {
    const batches = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      batches.push(arr.slice(i, i + batchSize));
    }
    return batches;
  }

  // Метод для удаления пустых тегов из XML
  removeEmptyTags(xml) {
    const tagsToKeep = ['currency']; // Теги, которые нужно сохранить
    return xml
      .replace(/<(\w+)([^>]*)>\s*<\/\1>/g, (match, tagName) =>
        tagsToKeep.includes(tagName) ? match : ''
      )
      .replace(/<(\w+)([^>]*)\/>/g, (match, tagName) =>
        tagsToKeep.includes(tagName) ? match : ''
      )
      .replace(/\n\s*\n/g, '\n'); // Удаление лишних переходов строк
  }

  // Метод для подстановки единиц измерения
  setUnits(value, unit) {
    return value ? `${value} ${unit}` : null;
  }

  // Метод для генерации YML
  generateYml(config) {
    const {feed, mapping, units} = config;

    const root = xmlbuilder
      .create('yml_catalog', {encoding: 'UTF-8'})
      .att('date', new Date().toISOString());

    const shop = root.ele('shop');
    shop.ele('name', {}, this.shopName);
    shop.ele('company', {}, this.companyName);
    shop.ele('url', {}, this.shopUrl);

    const currencies = shop.ele('currencies');
    currencies.ele('currency', {id: this.currency, rate: 1});

    const categoriesMap = new Map();

    // Сбор категорий
    this.products.forEach((product) => {
      this.processMapping(mapping, product);
      const replacer = this.createReplacer(product);
      const categoryId = replacer(mapping.categoryId);
      const categoryName = replacer(mapping.categoryName);

      if (categoryId && categoryName) {
        if (!categoriesMap.has(categoryId)) {
          categoriesMap.set(categoryId, categoryName);
        }
      }
    });

    // Создаем секцию categories перед секцией offers
    const categories = shop.ele('categories');
    categoriesMap.forEach((categoryName, categoryId) => {
      if (categoryId && categoryName) {
        categories.ele('category', {id: categoryId}, categoryName);
      }
    });

    const offers = shop.ele('offers');

    const productBatches = this.splitIntoBatches(this.products, this.batchSize);

    // Обработка каждого батча
    for (const batch of productBatches) {
      console.log(`Processing batch of ${batch.length} products...`);
      batch.forEach((product) => {
        this.processMapping(mapping, product);
        const replacer = this.createReplacer(product);

        const stableUUID = uuidv5(replacer(mapping.id).toString(), SECRET_SOL);
        const available = replacer(mapping.available);
        const price = replacer(mapping.price);
        const productUrl = replacer(mapping.url);
        const categoryId = replacer(mapping.categoryId);
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

        const offer = offers.ele('offer', {
          id: stableUUID,
          available,
        });

        offer.ele('url', {}, `${this.shopUrl}${productUrl}`);
        offer.ele('price', {}, price);
        offer.ele('currencyId', {}, this.currency);
        offer.ele('categoryId', {}, categoryId);
        offer.ele('name', {}, name);
        offer.ele('description', {}, description);
        offer.ele('manufacturer_warranty', {}, manufacturerWarranty);
        offer.ele('country_of_origin', {}, countryOfOrigin);

        // Добавляем изображения
        if (picture) {
          offer.ele('picture', {}, `${this.mediaPath}${picture}`);
        }

        if (gallery && gallery?.data?.length) {
          gallery?.data?.forEach((image) => {
            offer.ele('picture', {}, `${this.mediaPath}${image?.attributes?.url}`);
          });
        }

        if (feed === 'automobile' || feed === 'special-equipment') {
          offer.ele('vendor', {}, vendor);
          offer.ele('mark', {}, mark);
          offer.ele('model', {}, model);
          offer.ele('year', {}, year);
          offer.ele('type', {}, getTranslation(type, 'types'));
          offer.ele('body_type', {}, getTranslation(bodyType, 'body_type'));
          offer.ele('color', {}, getTranslation(color, 'colors'));
          offer.ele('engine_type', {}, getTranslation(engineType, 'engine_type'));
          offer.ele('transmission', {}, getTranslation(transmission, 'transmission'));
          offer.ele('drive', {}, getTranslation(drive, 'drive'));
          offer.ele('horsepower', {}, this.setUnits(horsePowers, units?.horsePower || 'л.с.'));
          offer.ele('engine_capacity', {}, this.setUnits(engineCapacity, units?.engineCapacity || 'литров'));
          offer.ele('mileage', {}, this.setUnits(mileage, units?.mileage || 'км'));
          offer.ele('number_of_doors', {}, numberOfDoors);
          offer.ele('number_of_seats', {}, numberOfSeats);
          offer.ele('fuel_type', {}, getTranslation(fuelType, 'fuel_type'));
          offer.ele('fuel_consumption', {}, fuelConsumption);
          offer.ele('condition', {}, getTranslation(condition, 'condition'));
          offer.ele('owner_count', {}, ownerCount);
          offer.ele('customs_cleared', {}, customsCleared && 'Да');
          offer.ele('vin', {}, vin);
          offer.ele('dealer', {}, dealer && 'Официальный дилер');
        }

        if (feed === 'special-equipment') {
          offer.ele('equipment_type', {}, getTranslation(equipmentType, 'equipment_type'));
          offer.ele('weight', {}, this.setUnits(weight, units?.weight || 'кг'));
          offer.ele('max_load_capacity', {}, this.setUnits(maxLoadCapacity, units?.maxLoadCapacity || 'кг'));
          offer.ele('engine_power', {}, this.setUnits(enginePower, units?.enginePower || 'кВт'));
          offer.ele('engine_model', {}, engineModel);
          offer.ele('fuel_tank_capacity', {}, this.setUnits(fuelTankCapacity, units?.fuelTankCapacity || 'литров'));
          offer.ele('operating_hours', {}, operatingHours);

          if (length && width && height) {
            offer.ele('dimensions', {}, `${length}x${width}x${height} ${units?.dimensions || 'м'}`);
          }
        }
      });
    }

    let xmlContent = root.end({pretty: true});

    xmlContent = this.removeEmptyTags(xmlContent);

    return xmlContent;
  }

  // Метод для сохранения файла
  async saveYmlFile(content) {
    try {
      const filePath = path.join(this.outputDir, this.outputFile);
      await ensureExists(this.outputDir); // Убедимся, что путь существует
      await fs.writeFile(filePath, content, 'utf8');
      console.log('YML file saved to', filePath);
    } catch (err) {
      console.error('Failed to save YML file:', err);
      throw new Error('Error saving YML file.');
    }
  }
}
