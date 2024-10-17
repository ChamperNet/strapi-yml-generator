/*
 * Copyright (C) 2024
 * Iskakov Timur
 * Champer.ru
 */

const dotenv = require('dotenv');
const path = require('path');

// Загрузка переменных среды из .env
dotenv.config({path: path.resolve(__dirname, '.env')});

module.exports = {
  apps: [
    {
      name: 'yml-generator', // Название процесса
      script: path.resolve(__dirname, 'node_modules/strapi-yml-generator/cli.js'),
      args: 'run', // Аргумент для запуска команды run
      cron_restart: '0 */6 * * *', // Перезапуск каждые 6 часов
      watch: false, // Не отслеживать изменения файлов
      autorestart: true, // Автоматический перезапуск при сбоях
      max_restarts: 5, // Максимальное количество перезапусков при сбое
      env: {
        ...process.env, // Использование всех переменных окружения из .env
        NODE_ENV: 'production' // Переключение в production-режим
      },
      error_file: path.resolve(__dirname, 'logs', 'yml-generator-error.log'), // Файл для логирования ошибок
      out_file: path.resolve(__dirname, 'logs', 'yml-generator-out.log'), // Файл для обычного логирования
      log_date_format: 'YYYY-MM-DD HH:mm Z' // Форматирование даты в логах
    }
  ]
};
