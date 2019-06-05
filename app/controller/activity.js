'use strict'

// const transitions = [
//   { name: 'carpick', from: 'state1', to: 'state2' }
// ]

const Controller = require('egg').Controller

class ActivityController extends Controller {

  async delete() {
    const { orderMachine } = this.app.config
    const order = this.ctx.service.getOrder()
    const fsm = orderMachine(order)

    console.log(fsm)

    this.ctx.body = {
      text: '操作成功'
    }
  }

  async reject() {

    this.ctx.body = {
      text: '操作成功'
    }
  }

  async finish() {

    this.ctx.body = {
      text: '操作成功'
    }
  }
}

module.exports = ActivityController
