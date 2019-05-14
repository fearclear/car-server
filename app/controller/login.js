'use strict'

const Controller = require('egg').Controller

class LoginController extends Controller {
  async login() {
    console.log(this.ctx.request.body)
    this.ctx.body = {
      text: '哈哈哈'
    }

  }
}

module.exports = LoginController
