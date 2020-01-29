import { promises as fs } from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import puppeteer from 'puppeteer'
import cliProgress from 'cli-progress'
import { getConfig } from './config'

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

const takeScreenshot = (page, url, config) =>
  new Promise(async (resolve, reject) => {
    const link = `https://${url}`
    try {
      await page.goto(link)
      const filename = `${url.replace(/\./gs, '_')}.png`
      await page.screenshot({
        path: path.join(config.screenshots, filename),
      })
      screenshots.push(filename)
      progressBar.update(screenshots.length)
    } catch (e) {
      console.error(e)
    } finally {
      if (screenshots.length === config.count) {
        progressBar.stop()
        await fs.writeFile(config.outputList, screenshots.join('\n'), 'utf8')
        console.log(
          `${screenshots.length}/${config.count} screenshots in "${config.screenshots}" folder`
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

    const urls = await getUrlList(config.inputList)

    progressBar.start(config.count, 0)

    urls
      .filter(url => !config.excludes.includes(url))
      .slice(0, config.count * 1.2)
      .reduce(
        (p, url, index) => p.then(() => takeScreenshot(page, url, config)),
        Promise.resolve()
      )
      .then(() => {
        console.log(
          `${screenshots.length} screenshots in "${config.screenshots}"`
        )
        process.exit(0)
      })
  })
  .catch(error => console.error(error))
