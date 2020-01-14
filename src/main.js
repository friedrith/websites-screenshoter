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

const takeScreenshot = (page, url, screenshots, progress) =>
  new Promise(async (resolve, reject) => {
    const link = `https://${url}`
    try {
      process.stdout.write(`[${parseInt(progress * 100)}%]: ${link}`)
      await page.goto(link)
      const filename = url.replace(/\./, '_')
      await page.screenshot({ path: path.join(screenshots, `${filename}.png`) })
      screenshotsFinished++
    } catch (e) {
      console.error(e)
    } finally {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
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
      .slice(0, config.count)
      .reduce(
        (p, url, index) =>
          p.then(() =>
            takeScreenshot(page, url, config.screenshots, index / config.count)
          ),
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
