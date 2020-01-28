import { promises as fs } from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import puppeteer from 'puppeteer'
import { getConfig } from './config'

const cleanScreenshots = screenshots =>
  new Promise((resolve, reject) => {
    rimraf(screenshots, err => {
      if (err) {
        reject()
      } else {
        resolve()
      }
    })
  })

const getUrlList = filename =>
  fs.readFile(filename, 'utf8').then(list => {
    return list.split(/\n/)
  })

let screenshotsFinished = 0

const takeScreenshot = (page, url, config) =>
  new Promise(async (resolve, reject) => {
    const link = `https://${url}`
    try {
      const progress = parseInt((100 * screenshotsFinished) / config.count)
      process.stdout.write(`[${progress}%]: ${link}`)
      await page.goto(link)
      const filename = url.replace(/\./, '_')
      await page.screenshot({
        path: path.join(config.screenshots, `${filename}.png`),
      })
      screenshotsFinished++
    } catch (e) {
      console.error(e)
    } finally {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)

      if (screenshotsFinished === config.count) {
        console.log(
          `${screenshotsFinished}/${config.count} screenshots in "${config.screenshots}"`
        )
        process.exit(0)
      }

      resolve()
    }
  })

getConfig()
  .then(async config => {
    await cleanScreenshots(config.screenshots)
    await fs.mkdir(config.screenshots)

    // https://github.com/puppeteer/puppeteer
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
      ...config.size,
      deviceScaleFactor: 1,
    })

    const urls = await getUrlList(config.list)

    urls
      .filter(url => !config.excludes.includes(url))
      .slice(0, config.count * 1.2)
      .reduce(
        (p, url, index) => p.then(() => takeScreenshot(page, url, config)),
        Promise.resolve()
      )
      .then(() => {
        console.log(
          `${screenshotsFinished} screenshots in "${config.screenshots}"`
        )
        process.exit(0)
      })
  })
  .catch(error => console.error(error))
