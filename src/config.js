import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'

export const getConfig = () =>
  new Promise((resolve, reject) => {
    try {
      const dirname = path.join(__dirname, '../config')
      const configFilename = path.join(dirname, 'config.yaml')
      const config = yaml.safeLoad(fs.readFileSync(configFilename, 'utf8'))
      resolve({
        ...config,
        list: path.join(dirname, config.list),
        screenshots: path.join(__dirname, '../', config.screenshots),
      })
    } catch (e) {
      reject(e)
    }
  })
