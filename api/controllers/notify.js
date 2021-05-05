const Mail = require('../helpers/mailer')
const Bot = require('../helpers/telegram')

const types = ['New message 📨', 'New request a quote 🚀']

const send = async (req, res) => {
  let type = 0
  const data = req.swagger.params.data.value

  const template = `
🔔 Welcome, example`

  await Promise.all([
    // Mail.sendMail({
    //   from: '"Example 🧚‍♀️" <example@email.com>',
    //   to: 'example@email.com',
    //   subject: types[type],
    //   text: template,
    //   //html
    // }),
    Bot.sendMessage(
      '@yourspacechat',
      `
    ${types[type]}
    ${template}
    `
    ),
  ])

  res.json({ success: true })
}

module.exports = {
  send,
}
