'use strict'

const md5 = require('md5')
const moment = require('moment')
const nodemailer = require('nodemailer')
const MarkdownIt = require('markdown-it')
const private_config = require('../../config/private_config')

/** *************
 * moment 设置
 */
moment.locale('zh-cn')

/** *************
 * markdown 设置
 */
const md = new MarkdownIt()
md.set({
  html: false, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />)
  breaks: false, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
  typographer: true // Enable smartypants and other sweet transforms
})

/** ***************
 * nodemailer设置
 */

const transporter = nodemailer.createTransport({
  service: 'qq',
  secureConnection: true, // use SSL
  port: 465, // port
  auth: private_config.mail.auth
})

module.exports = {
  salt(salt, str) {
    return md5(salt + str)
  },
  parseWxData(res) {
    return JSON.parse(res.data.toString())
  },
  mail(mailOptions) {
    mailOptions = mailOptions ? mailOptions : {
      from: '"xxx" <xxx@qq.com>', // login user must equel to this user
      to: 'xxx@qq.com',
      subject: 'Title Nodejs Send',
      text: 'Some simple words.',
      html: '<b>The main content of the mail. You have successfully logged in to Nodejs.</b>'
    }
    transporter.sendMail(mailOptions, function(error, info) {
      if(error) {
        console.log(error, 'error')
        return console.log(error)
      }
      this.app.logger.info(`Message send: ${info.response}`)
    })
  }
}
