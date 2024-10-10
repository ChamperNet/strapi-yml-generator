# strapi-yml-generator

Script for generating the YML-file from Strapi CMS product's entity,

## Installation

To use this package, you need to install it in your project:

```sh
npm install strapi-yml-generator
```

## Initialization

First, you need to initialize the script

```sh
npx strapi-yml-generator init
```

This will create a `.env` file in the root of your project. Fill in the required values:

```dotenv
# Settings
PORT=3030
DOMAIN="your-domain-name.com"
IP_ADDRESS=

# Strapi API URL
STRAPI_API_URL=https://your-strapi-api.com

# Shop details
SHOP_NAME="Your Shop Name"
COMPANY_NAME="Your Company Name"
SHOP_URL=https://your-shop-url.com

# Currency and Category info
CURRENCY=RUB
CATEGORY_ID=1
CATEGORY_NAME="Автотовары"

# YML File path
YML_FILE_PATH=./public/uploads/feeds/yandex_market.yml

```

This will also create an `ecosystem.config.js` file and fill it with that:

```js
module.exports = {
   apps: [
      {
         name: 'yml-generator',
         script: path.resolve(__dirname, 'node_modules/strapi-yml-generator/server.js'),
         args: 'run',
         cron_restart: '0 */6 * * *',
         watch: false,
         autorestart: true,
         max_restarts: 5,
         env: {
            ...process.env,
            NODE_ENV: 'production'
         },
         error_file: path.resolve(__dirname, 'logs', 'yml-generator-error.log'),
         out_file: path.resolve(__dirname, 'logs', 'yml-generator-out.log'),
         log_date_format: 'YYYY-MM-DD HH:mm Z'
      }
   ]
};


```

Change the generation's timeout value if needed.

## Usage
To run the backup script manually, use the `run` command:

```sh
npx strapi-yml-generator run
```

## Workflow
The logic that this script follows includes several key steps:

### 1. Initialization (init command)
   When you run the command strapi-yml-generator init, the following actions take place:

- Environment Setup: The script looks for an .env file in the current working directory. If the file doesn't exist, it copies a template .env file from the module and creates it in your project. This file contains necessary configuration variables such as API URLs, shop information, and paths for output files.
- Directory Creation: The script checks if the feeds directory exists inside public/uploads/. If it doesn't, it creates the directory where the YML files will be stored. This is necessary to store your generated feeds for Yandex.Market.
- Ecosystem Configuration: A default ecosystem.config.js file for PM2 is created if it doesn't already exist. This file allows you to automate the periodic generation of YML files using a cron job.
- .gitignore Setup: If a .gitignore file doesn't exist, the script creates one and adds essential exclusions, such as the .env file, the node_modules folder, and the feeds directory. This prevents sensitive information and temporary files from being committed to version control.

### 2. YML Generation (run command)
When you run the command strapi-yml-generator run, the following actions take place:

- Loading Configuration: The script loads configuration values from the .env file, such as the Strapi API URL, shop details (name, URL, currency, etc.), and the path where the YML file will be saved.
- Fetching Products: It sends a request to the Strapi API to fetch the list of products that will be included in the YML file. This data is typically retrieved from a specific endpoint (e.g., /products).
- YML Generation: Using the YmlGenerator class, the script constructs a YML file in the format required by Yandex.Market. This file contains all necessary information about your products, such as product name, price, description, and URL.
- Saving the YML File: Once generated, the YML file is saved to the feeds directory inside public/uploads/feeds. This ensures that the file is ready to be accessed and distributed.

### 3. Automated YML Generation with PM2
To ensure that your YML file is regularly updated, the script can be configured to run periodically via PM2. After running the init command, a cron job is set up in the ecosystem.config.js file to generate the YML file every 6 hours.

- PM2 Cron Job: The ecosystem.config.js file includes a cron job that restarts the strapi-yml-generator process every 6 hours. This ensures that the YML file is automatically updated with the latest product data without manual intervention.
- Manual Start and Stop: You can manually control the PM2 process with commands such as pm2 start ecosystem.config.js and pm2 stop ecosystem.config.js. This allows you to start or stop the YML generation service as needed.

### 4. Error Handling
- Directory and File Creation Errors: If any errors occur during the initialization of directories or files, they are logged to the console. The script ensures that each step is checked before proceeding to avoid overwriting existing files.
- API Fetch Errors: When fetching product data from the Strapi API, the script logs any network or API-related errors. These errors will also be logged during PM2-managed runs, ensuring that issues are visible in log files. 

## Summary:
This workflow automates the generation of YML files for Yandex.Market and ensures that the latest product data from your Strapi API is regularly included. By using PM2, the script can periodically regenerate the YML feed, while the CLI commands allow you to manually initialize or generate the feed as needed.
