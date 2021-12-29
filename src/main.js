import { promises as fs } from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import puppeteer from 'puppeteer'
import cliProgress from 'cli-progress'
import { getConfig, logger } from './config'

const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic
)

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

const screenshots = []

const takeScreenshot = (page, url, config, count) =>
  new Promise(async (resolve, reject) => {
    const link = `https://${url}`
    try {
      const result = await page.goto(link)
      if (result.status() !== 200) {
        throw `status ${result.status()}`
      }
      const filename = `${url.replace(/\./gs, '_')}.png`
      await page.screenshot({
        path: path.join(config.screenshots, filename),
      })
      screenshots.push(filename)
      progressBar.update(screenshots.length)
    } catch (e) {
      console.log()
      console.error(`error on "${link}"`)
      logger.error({ error: e })
    } finally {
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

    const urls = await getUrlList(config.inputList)

    progressBar.start(urls.length, 0)

    urls
      .filter(url => !config.excludes.includes(url))
      .slice(0, config.count * 1.2)
      // https://css-tricks.com/why-using-reduce-to-sequentially-resolve-promises-works/
      .reduce((p, url) => {
        if (screenshots.length < config.count) {
          return p.then(() => takeScreenshot(page, url, config, urls.length))
        } else {
          return Promise.resolve()
        }
      }, Promise.resolve())
      .then(() => {
        progressBar.stop()
        console.log(
          `${screenshots.length} screenshots in "${config.screenshots}"`
        )
      })
      .then(() =>
        fs.writeFile(config.outputList, screenshots.join('\n'), 'utf8')
      )
      .then(() => {
        console.log(`Write list in "${config.outputList}"`)
      })
      .then(() => {
        process.exit(0)
      })
  })
  .catch(error => console.error(error))
