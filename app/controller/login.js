'use strict'
const private_config = require('../../config/private_config')

const Controller = require('egg').Controller

class LoginController extends Controller {
  async login() {
    console.log(this.ctx.request.body)
    const params = this.ctx.request.body
    const result = await this.ctx.app.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${private_config.wxapp.appid}&secret=${private_config.wxapp.secret}&js_code=${params.code}&grant_type=authorization_code`)
    console.log(this.ctx.helper.parseWxData(result))
    this.ctx.body = {
      text: '哈哈哈'
    }
  }

  async getPhoneNumber() {
    this.ctx.body = {

    }
  }
}


module.exports = LoginController
