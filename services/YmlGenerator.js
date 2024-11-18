import fs from 'fs/promises';
import path from 'path';
import { v5 as uuidv5 } from 'uuid';
import xmlbuilder from 'xmlbuilder';
import { ensureExists } from '../plugins/file.js';
import { getTranslation } from '../plugins/translations.js';

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
        console.error(`Error processing expression: ${ expression }`, e);
        return ''; // Если ошибка, возвращаем пустую строку
      }
    });
  }

  // Метод для выполнения динамической логики
  executeDynamicLogic(expression, data) {
    try {
      const safeExpression = expression.startsWith('data.') ? expression : `data.${ expression }`;
      const func = new Function('data', `return ${ safeExpression };`);
      return func(data);
    } catch (e) {
      console.error(`Error executing dynamic logic: ${ expression }`, e);
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
      .replace(/<(\w+)([^>]*)>\s*<\/\1>/g, (match, tagName) => tagsToKeep.includes(tagName) ? match : '')
      .replace(/<(\w+)([^>]*)\/>/g, (match, tagName) => tagsToKeep.includes(tagName) ? match : '')
      .replace(/\n\s*\n/g, '\n'); // Удаление лишних переходов строк
  }

  // Метод для подстановки единиц измерения
  setUnits(value, unit) {
    return value ? `${ value } ${ unit }` : null;
  }

  // Метод для генерации YML
  generateYml(config) {
    const { feed, mapping, units } = config;

    const root = xmlbuilder
      .create('yml_catalog', { encoding: 'UTF-8' })
      .att('date', new Date().toISOString());

    const shop = root.ele('shop');
    shop.ele('name', {}, this.shopName);
    shop.ele('company', {}, this.companyName);
    shop.ele('url', {}, this.shopUrl);

    const currencies = shop.ele('currencies');
    currencies.ele('currency', { id: this.currency, rate: 1 });

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
        categories.ele('category', { id: categoryId }, categoryName);
      }
    });

    const offers = shop.ele('offers');

    const productBatches = this.splitIntoBatches(this.products, this.batchSize);

    // Обработка каждого батча
    for (const batch of productBatches) {
      console.log(`Processing batch of ${ batch.length } products...`);
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
        const type = replacer(mapping.type);
        const vendor = replacer(mapping.vendor);
        const model = replacer(mapping.model);
        const weight = replacer(mapping.weight);
        const length = replacer(mapping.length);
        const width = replacer(mapping.width);
        const height = replacer(mapping.height);

        // params
        const mark = replacer(mapping.mark);
        const year = replacer(mapping.year);
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
        const maxLoadCapacity = replacer(mapping.maxLoadCapacity);
        const enginePower = replacer(mapping.enginePower);
        const engineModel = replacer(mapping.engineModel);
        const fuelTankCapacity = replacer(mapping.fuelTankCapacity);
        const operatingHours = replacer(mapping.operatingHours);

        const offer = offers.ele('offer', {
          id: stableUUID, available,
        });

        offer.ele('url', {}, `${ this.shopUrl }${ productUrl }`);
        offer.ele('price', {}, price);
        offer.ele('currencyId', {}, this.currency);
        offer.ele('categoryId', {}, categoryId);
        offer.ele('name', {}, name);
        offer.ele('description', {}, description);
        offer.ele('manufacturer_warranty', {}, manufacturerWarranty);
        offer.ele('country_of_origin', {}, countryOfOrigin);

        // Добавляем изображения
        if (picture) {
          offer.ele('picture', {}, `${ this.mediaPath }${ picture }`);
        }

        if (gallery && gallery?.data?.length) {
          gallery?.data?.forEach((image) => {
            offer.ele('picture', {}, `${ this.mediaPath }${ image?.attributes?.url }`);
          });
        }

        if (length && width && height) {
          offer.ele('dimensions', {}, `${ length }/${ width }/${ height }`);
        }

        if (weight) {
          offer.ele('weight', {}, weight);
        }

        if (feed === 'automobile' || feed === 'special-equipment') {
          offer.ele('typePrefix', {}, getTranslation(equipmentType, 'equipment_type'));
          offer.ele('vendor', {}, vendor);
          offer.ele('model', {}, model);

          // Формируем params
          offer.ele('param', { name: getTranslation('year', 'params') }, year);
          offer.ele('param', { name: getTranslation('drive', 'params') }, getTranslation(drive, 'drive'));
          offer.ele('param', { name: getTranslation('body_type', 'params') }, getTranslation(bodyType, 'body_type'));
          offer.ele('param', { name: getTranslation('mark', 'params') }, mark);
          offer.ele('param', { name: getTranslation('mileage', 'params'), unit: units?.mileage || 'км' }, mileage);
          offer.ele('param', {
            name: getTranslation('horse_powers', 'params'), unit: units?.horsePower || 'л.с.'
          }, horsePowers);
          offer.ele('param', {
            name: getTranslation('engine_capacity', 'params'), unit: units?.engineCapacity || 'литров'
          }, engineCapacity);
          offer.ele('param', {
            name: getTranslation('fuel_consumption', 'params'), unit: units?.fuelConsumption || 'л./100км'
          }, fuelConsumption);
          offer.ele('param', { name: getTranslation('owner_count', 'params') }, ownerCount);
          offer.ele('param', { name: getTranslation('customs_cleared', 'params') }, customsCleared && 'Да');
          offer.ele('param', { name: getTranslation('number_of_doors', 'params') }, numberOfDoors);
          offer.ele('param', { name: getTranslation('number_of_seats', 'params') }, numberOfSeats);
          offer.ele('param', { name: getTranslation('color', 'params') }, getTranslation(color, 'colors'));
          offer.ele('param', { name: getTranslation('type', 'params') }, getTranslation(type, 'types'));
          offer.ele('param', { name: getTranslation('engine_type', 'params') }, getTranslation(engineType, 'engine_type'));
          offer.ele('param', { name: getTranslation('fuel_type', 'params') }, getTranslation(fuelType, 'fuel_type'));
          offer.ele('param', { name: getTranslation('transmission', 'params') }, getTranslation(transmission, 'transmission'));
          offer.ele('param', { name: getTranslation('condition', 'params') }, getTranslation(condition, 'condition'));
          offer.ele('param', { name: getTranslation('vin', 'params') }, vin);
          offer.ele('param', { name: getTranslation('dealer', 'params') }, dealer && 'Да');
        }

        if (feed === 'special-equipment') {
          // Формируем params
          offer.ele('param', { name: getTranslation('equipment_type', 'params') }, getTranslation(equipmentType, 'equipment_type'));
          offer.ele('param', {
            name: getTranslation('max_load_capacity', 'params'), unit: units?.maxLoadCapacity || 'кг'
          }, maxLoadCapacity);
          offer.ele('param', {
            name: getTranslation('engine_power', 'params'), unit: units?.enginePower || 'кВт'
          }, enginePower);
          offer.ele('param', { name: getTranslation('engine_model', 'params') }, engineModel);
          offer.ele('param', {
            name: getTranslation('fuel_tank_capacity', 'params'), unit: units?.fuelTankCapacity || 'литров'
          }, fuelTankCapacity);
          offer.ele('param', { name: getTranslation('operating_hours', 'params') }, operatingHours);
        }
      });
    }

    let xmlContent = root.end({ pretty: true });

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
