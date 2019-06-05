'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test/app/controller/activity.test.js', () => {
  let fsm

  const orderState = {
    running: '1', // 进行中
    rejected: '2', // 已拒绝
    finished: '3', // 已完成
    deleted: '4' // 已删除
  }

  before(() => {
    const orderMachine = app.config.orderMachine
    fsm = orderMachine()
    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  })

  it('初始化流程', () => {
    assert(fsm.state === orderState.running)
  })

  it('结束流程', () => {
    fsm.finish()
    assert(fsm.state === orderState.finished)
  })

  it('已结束流程删除', () => {
    assert(fsm.can('delete'))
  })

  it('已结束流程不能拒绝', () => {
    assert(fsm.cannot('reject'))
  })

})
