#!/usr/bin/env node

import {Command} from 'commander'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'

// Получаем путь к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()
program.version('1.0.0')

program
  .command('init')
  .description('Initialize the YML generator configuration')
  .action(() => {
    const cwd = process.cwd()
    const feedsDir = path.resolve(cwd, 'feeds')

    const templateEnvPath = path.resolve(__dirname, 'template.env')
    const destinationEnvPath = path.resolve(cwd, '.env')

    const ecosystemTemplate = path.resolve(__dirname, 'ecosystem.config.js')
    const ecosystemPath = path.resolve(cwd, 'ecosystem.config.js')

    const gitignoreTemplate = path.resolve(__dirname, '.gitignore')
    const gitignorePath = path.resolve(cwd, '.gitignore')

    // Create file .env
    if (!fs.existsSync(destinationEnvPath)) {
      fs.copyFileSync(templateEnvPath, destinationEnvPath)
      console.log('.env file has been created. Please fill in the required values.')
    } else {
      console.log('.env file already exists.')
    }

    // Ensure the backups directory exists
    if (!fs.existsSync(feedsDir)) {
      fs.mkdirSync(feedsDir, {recursive: true})
      console.log('Feeds directory has been created.')
    } else {
      console.log('Feeds directory already exists.')
    }

    // Create ecosystem.config.js
    if (!fs.existsSync(ecosystemPath)) {
      fs.copyFileSync(ecosystemTemplate, ecosystemPath)
      console.log('ecosystem.config.js file has been created.')
    } else {
      console.log('ecosystem.config.js file already exists.')
    }

    // Create .gitignore
    if (!fs.existsSync(gitignorePath)) {
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
      `
      fs.writeFileSync(gitignorePath, gitignoreContent.trim())
      console.log('.gitignore file has been created.')
    } else {
      console.log('.gitignore file already exists.')
    }
  })

program.parse(process.argv)
