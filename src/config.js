import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'

export const getConfig = () =>
  new Promise((resolve, reject) => {
    try {
      const dirname = path.join(__dirname, '../')
      const configFilename = path.join(dirname, 'config.yaml')
      const config = yaml.safeLoad(fs.readFileSync(configFilename, 'utf8'))
      resolve(config)
    } catch (e) {
      reject(e)
    }
  })
