import express from 'express'

import logger from './utils/logger'

const app = express()

app.get('/', function(req, res) {
  res.send('hello world!')
})

const listener = app.listen(process.PORT || 3000, () => {
  logger.info('listening', { port: listener.address().port })
})
