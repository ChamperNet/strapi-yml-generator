/*
 * Copyright (C) 2024
 * Iskakov Timur
 * Champer.ru
 */

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.resolve(__dirname, '.env')});

module.exports = {
  apps: [
    {
      name: 'backup',
      script: 'node_modules/strapi-yml-generator/server.js',
      args: 'run',
      cron_restart: '0 */6 * * *', // Run every 6 hours
      watch: false,
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    }
  ]
};
