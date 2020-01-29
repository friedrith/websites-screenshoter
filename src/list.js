import https from 'https'
import fs from 'fs'

import cheerio from 'cheerio'

import { getConfig } from './config'

var options = {
  host: 'moz.com',
  path: '/top500',
}

https
  .get(options, res => {
    console.log('Got response: ' + res.statusCode)

    let html = ''

    res.on('data', d => {
      html += d
    })

    res.on('end', () => {
      const $ = cheerio.load(html)

      const urls = []

      $('tbody a').each(function(index, element) {
        urls.push($(this).text())
      })

      getConfig()
        .then(config => {
          const list = urls
            .filter(url => !config.excludes.includes(url))
            .join('\n')

          fs.writeFile(config.inputList, list, 'utf8', () => {})
        })
        .catch(error => {
          console.log('error', error)
        })
    })
  })
  .on('error', function(e) {
    console.log('Got error: ' + e.message)
  })
