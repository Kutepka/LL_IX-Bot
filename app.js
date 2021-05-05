'use strict'

const SwaggerExpress = require('swagger-express-mw')
const http = require('http')
const https = require('https')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const express = require('express')
const cors = require('cors')
const bot = require('./api/helpers/telegram');
require('colors')
require('dotenv').config()

bot.on('message', (msg) => {
  if (msg.new_chat_members != undefined && !msg.new_chat_member.is_bot) {
    bot.getChatMember(msg.chat.id, msg.new_chat_member.id).then((data) => {
      const name = [data.user.first_name, data.user.last_name].join(' ');

      bot.sendMessage(msg.chat.id, `Welcome, ${name.length ? name.trim() : data.user.username}!`);
    });
  }
})

const app = express()

module.exports = app

const config = {
  appRoot: __dirname,
}

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err
  }

  app.set('trust proxy', true)
  app.use(
    cors({
      origin: process.env.ORIGIN || 'localhost',
      credentials: true,
    })
  )
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(express.static('uploads'))
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
    })
  )

  swaggerExpress.register(app)

  let server
  if (process.env.HTTPS === 'true') {
    server = https.createServer(
      {
        key: fs.readFileSync(process.env.SSL_KEY || 'server.key'),
        cert: fs.readFileSync(process.env.SSL_CERT || 'server.cert'),
      },
      app
    )
  } else {
    server = http.createServer(app)
  }

  server.listen(process.env.PORT || 10010)

  console.log('[LLIX]'.brightMagenta + ' is already listening'.brightGreen)
})
