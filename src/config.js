import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'
import winston from 'winston'

export const getConfig = () =>
  new Promise((resolve, reject) => {
    try {
      const dirname = path.join(__dirname, '../config')
      const configFilename = path.join(dirname, 'config.yaml')
      const config = yaml.safeLoad(fs.readFileSync(configFilename, 'utf8'))
      resolve({
        ...config,
        inputList: path.join(dirname, config.inputList),
        outputList: path.join(dirname, config.outputList),
        screenshots: path.join(__dirname, '../', config.screenshots),
      })
    } catch (e) {
      reject(e)
    }
  })

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../config/combined.log'),
    }),
  ],
})
