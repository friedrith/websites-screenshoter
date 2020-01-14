import https from 'https'
import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'

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
        getConfig()
          .then(config => {
            console
            fs.writeFile(config.list, urls.join('\n'), 'utf8', () => {})
          })
          .catch(error => {
            console.log('error', error)
          })
      })

      // console.log(html)
    })
  })
  .on('error', function(e) {
    console.log('Got error: ' + e.message)
  })
