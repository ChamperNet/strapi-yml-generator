// translations.js

const typeTranslations = {
  car: "Легковой автомобиль",
  truck: "Грузовой автомобиль",
  special_equipment: "Спецтехника",
};

const transmissionTranslations = {
  automate: "Автоматическая",
  mechanical: "Механическая",
  robotics: "Робот",
  variator: "Вариатор",
};

const driveTranslations = {
  full: "Полный",
  front: "Передний",
  rear: "Задний",
};

const conditionTranslations = {
  new: "Новый",
  used: "Подержанный",
};

const engineTypeTranslations = {
  gasoline: "Бензиновый",
  diesel: "Дизельный",
  electric: "Электрический",
  hybrid: "Гибрид",
  gas: "Газовый"
};

const fuelTypeTranslations = {
  gasoline: "Бензин",
  diesel: "Дизель",
  electric: "Электричество",
  hybrid: "Гибрид",
  gas: "Газ"
};

const colorsTranslations = {
  alizarin: "Ализарин",
  amaranth: "Амарант",
  amber: "Янтарь",
  amethyst: "Аметист",
  apricot: "Абрикос",
  aqua: "Аква",
  aquamarine: "Аквамарин",
  asparagus: "Спаржа",
  auburn: "Каштановый",
  azure: "Лазурный",
  beige: "Бежевый",
  bistre: "Бистр",
  black: "Черный",
  blue: "Синий",
  "blue-green": "Сине-зеленый",
  "blue-violet": "Сине-фиолетовый",
  "bondi-blue": "Бонди синий",
  brass: "Латунь",
  bronze: "Бронза",
  brown: "Коричневый",
  buff: "Охра",
  burgundy: "Бордовый",
  "camouflage-green": "Камуфляжный зеленый",
  "caput-mortuum": "Капут-мортум",
  cardinal: "Кардинал",
  carmine: "Кармин",
  "carrot-orange": "Морковный",
  celadon: "Целадон",
  cerise: "Вишневый",
  cerulean: "Синий небесный",
  champagne: "Шампань",
  charcoal: "Угольно-черный",
  chartreuse: "Шартрез",
  "cherry-blossom-pink": "Розовый вишневый цвет",
  chestnut: "Каштановый",
  chocolate: "Шоколадный",
  cinnabar: "Киноварь",
  cinnamon: "Корица",
  cobalt: "Кобальт",
  copper: "Медный",
  coral: "Коралл",
  corn: "Кукуруза",
  cornflower: "Василек",
  cream: "Кремовый",
  crimson: "Малиновый",
  cyan: "Циан",
  dandelion: "Одуванчик",
  denim: "Деним",
  ecru: "Экрю",
  emerald: "Изумруд",
  eggplant: "Баклажан",
  "falu-red": "Фалу красный",
  "fern-green": "Папоротниково-зеленый",
  firebrick: "Огнеупорный кирпич",
  flax: "Льняной",
  "forest-green": "Лесной зеленый",
  "french-rose": "Французская роза",
  fuchsia: "Фуксия",
  gamboge: "Гамбо",
  gold: "Золотой",
  goldenrod: "Золотарник",
  green: "Зеленый",
  grey: "Серый",
  "han-purple": "Хань фиолетовый",
  harlequin: "Арлекин",
  heliotrope: "Гелиотроп",
  "hollywood-cerise": "Голливудская цериза",
  indigo: "Индиго",
  ivory: "Слоновая кость",
  jade: "Нефритовый",
  "kelly-green": "Келли зеленый",
  khaki: "Хаки",
  lavender: "Лаванда",
  "lawn-green": "Травяной зеленый",
  lemon: "Лимонный",
  "lemon-chiffon": "Лимонный шифон",
  lilac: "Сиреневый",
  lime: "Лаймовый",
  "lime-green": "Лаймово-зеленый",
  linen: "Льняной",
  magenta: "Маджента",
  magnolia: "Магнолия",
  malachite: "Малахит",
  maroon: "Марун",
  mauve: "Бледно-лиловый",
  "midnight-blue": "Полуночный синий",
  "mint-green": "Мятно-зеленый",
  "misty-rose": "Туманная роза",
  "moss-green": "Мшистый зеленый",
  mustard: "Горчичный",
  myrtle: "Мирт",
  "navajo-white": "Навахо белый",
  "navy-blue": "Темно-синий",
  ochre: "Охра",
  "office-green": "Офисный зеленый",
  olive: "Оливковый",
  olivine: "Оливин",
  orange: "Оранжевый",
  orchid: "Орхидея",
  "papaya-whip": "Папайя",
  peach: "Персиковый",
  pear: "Грушевый",
  periwinkle: "Барвинок",
  persimmon: "Хурма",
  "pine-green": "Сосновый зеленый",
  pink: "Розовый",
  platinum: "Платиновый",
  plum: "Сливовый",
  "powder-blue": "Пудрово-голубой",
  puce: "Темно-красный",
  "prussian-blue": "Прусский синий",
  "psychedelic-purple": "Психоделический фиолетовый",
  pumpkin: "Тыквенный",
  purple: "Фиолетовый",
  "quartz-grey": "Кварцево-серый",
  "raw-umber": "Сырой умбра",
  razzmatazz: "Розовый шок",
  red: "Красный",
  "robin-egg-blue": "Сине-зеленый яичной скорлупы",
  rose: "Розовый",
  "royal-blue": "Королевский синий",
  "royal-purple": "Королевский фиолетовый",
  ruby: "Рубиновый",
  russet: "Красно-коричневый",
  rust: "Ржавчина",
  "safety-orange": "Оранжевый для безопасности",
  saffron: "Шафран",
  salmon: "Лососевый",
  "sandy-brown": "Песочно-коричневый",
  sangria: "Сангрия",
  sapphire: "Сапфировый",
  scarlet: "Алый",
  "school-bus-yellow": "Школьный автобус желтый",
  "sea-green": "Морская волна",
  seashell: "Ракушка",
  sepia: "Сепия",
  "shamrock-green": "Клеверный зеленый",
  "shocking-pink": "Шокирующий розовый",
  silver: "Серебряный",
  "sky-blue": "Небесно-голубой",
  "slate-grey": "Шиферный серый",
  smalt: "Смальта",
  "spring-bud": "Весенний бутон",
  "spring-green": "Весенний зеленый",
  "steel-blue": "Стальной синий",
  tan: "Загар",
  tangerine: "Мандариновый",
  taupe: "Серо-коричневый",
  teal: "Бирюзовый",
  "tenné-(tawny)": "Рыжевато-коричневый",
  "terra-cotta": "Терракота",
  thistle: "Чертополох",
  "titanium-white": "Титаново-белый",
  tomato: "Томатный",
  turquoise: "Бирюзовый",
  "tyrian-purple": "Тирский пурпур",
  ultramarine: "Ультрамарин",
  "van-dyke-brown": "Коричневый Ван Дейка",
  vermilion: "Киноварь",
  violet: "Фиолетовый",
  viridian: "Виридиан",
  wheat: "Пшеничный",
  white: "Белый",
  wisteria: "Глициния",
  yellow: "Желтый",
  zucchini: "Цуккини"
};

const bodyTypeTranslations = {
  sedan: "Седан",
  coupe: "Купе",
  suv: "Внедорожник",
  roadster: "Родстер",
  pickup: "Пикап",
  hatchback: "Хэтчбек",
  wagon: "Универсал",
  minivan: "Минивэн",
  convertible: "Кабриолет"
}

const equipmentTypeTranslations = {
  concrete_pump: "Автобетононасос",
  aerial_platform: "Автовышка",
  refrigerator_truck: "Авторефрижератор",
  truck: "Грузовик",
  roller: "Каток",
  combine: "Комбайн",
  crane: "Кран",
  skid_steer_loader: "Мини-погрузчик",
  loader: "Погрузчик",
  tractor: "Трактор",
  excavator: "Экскаватор",
};

// Функция для получения перевода
export function getTranslation(value, type) {
  // Словарь соответствий типов переводов
  const dictionaries = {
    types: typeTranslations,
    transmission: transmissionTranslations,
    drive: driveTranslations,
    engine_type: engineTypeTranslations,
    body_type: bodyTypeTranslations,
    colors: colorsTranslations,
    fuel_type: fuelTypeTranslations,
    condition: conditionTranslations,
    equipment_type: equipmentTypeTranslations
  };

  // Получаем нужный словарь по типу
  const dictionary = dictionaries[type];

  // Возвращаем перевод или оригинальное значение, если перевод не найден
  return dictionary?.[value] || value;
}
