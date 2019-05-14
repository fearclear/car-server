'use strict'

// const md5 = require('md5')
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

/** ***************
 * 校验规则正则初始化
 */

// 邮箱白名单
const emailWhilelist = [ 'qq.com', 'gmail.com', '163.com', '126.com', 'msn.com', 'hotmail.com', 'googlemail.com', 'mail.com',
  'aol.com', 'ask.com', 'live.com', '263.net', '3721.net', 'yiah.net', 'yahoo.com', 'aim.com', 'walla.com', 'foxmail.com',
  'inbox.com', 'sina.com', '21cn.com', 'soh.com', 'yahoo.com.cn', 'tom.com', 'etang.com', 'eyou.com', '56.com', 'x.cn', 'sina.cn',
  'chinaren.com', 'sogou.com', 'citiz.com', 'hongkong.com', 'ctimail.com', 'mail.hk.com', 'hknet.com', 'swe.com.hk', 'seed.net.tw' ]

const emailPattern = new RegExp(`${emailWhilelist.join('|')}$`, 'i')
const namePattern = /^([A-Za-z0-9]|[\u4E00-\uFA29]|[\uE7C7-\uE7F3])+(?:[_-]([A-Za-z0-9]|[\u4E00-\uFA29]|[\uE7C7-\uE7F3])+)*$/

module.exports = {
  salt(salt, str) {
    // return md5(salt + str)
    return str
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
  },
  rule: {
    userRule: {
      signInRule: {
        userName: { required: true, message: '请输入用户名' },
        password: { required: true, message: '请输入密码' }
      },
      signUpRule: {
        email: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '邮箱类型错误' },
          { pattern: emailPattern, message: '不支持的邮箱' }
        ],
        nickName: [
          { required: true, message: '请输入昵称' },
          { pattern: namePattern, message: '请输入合法的用户名' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ]
      }
    }
  }
}
