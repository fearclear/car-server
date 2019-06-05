'use strict'
const private_config = require('./private_config')
const StateMachine = require('javascript-state-machine')

module.exports = appInfo => {
  const config = exports = {}

  exports.cluster = {
    listen: {
      port: 7001
    }
  }

  config.name = private_config.name

  config.description = private_config.description

  config.debug = true

  config.session = {
    renew: true
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + private_config.appInfoKeys

  config.host = private_config.host

  config.session_secret = private_config.session_secret

  // add your config here
  config.middleware = [ 'gzip', 'response', 'authUser' ]

  config.gzip = {
    threshold: 1024
  }

  // CSRF
  config.security = {
    csrf: {
      enable: false,
      queryName: '_csrf',
      bodyName: '_csrf',
      headerName: 'x-fc-csrf',
      useSession: true,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken'
    }
  }

  config.mysql = {
    client: private_config.mysql.client,
    app: true,
    agent: false
  }

  // 规则
  /** ***************
 * 校验规则正则初始化
 */

  // 邮箱白名单
  const emailWhilelist = [ 'qq.com', 'gmail.com', '163.com', '126.com', 'msn.com', 'hotmail.com', 'googlemail.com', 'mail.com',
    'aol.com', 'ask.com', 'live.com', '263.net', '3721.net', 'yiah.net', 'yahoo.com', 'aim.com', 'walla.com', 'foxmail.com',
    'inbox.com', 'sina.com', '21cn.com', 'soh.com', 'yahoo.com.cn', 'tom.com', 'etang.com', 'eyou.com', '56.com', 'x.cn', 'sina.cn',
    'chinaren.com', 'sogou.com', 'citiz.com', 'hongkong.com', 'ctimail.com', 'mail.hk.com', 'hknet.com', 'swe.com.hk', 'seed.net.tw' ]

  const emailPattern = new RegExp(`${emailWhilelist.join('|')}$`, 'i')

  config.rule = {
    userRule: {
      signUpRule: {
        email: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '邮箱类型错误' },
          { pattern: emailPattern, message: '不支持的邮箱' }
        ]
      }
    }
  }

  // 订单状态机
  config.orderMachine = order => {
    order = order || {}
    const orderState = {
      running: '1', // 进行中
      rejected: '2', // 已拒绝
      finished: '3', // 已完成
      deleted: '4' // 已删除
    }
    return new StateMachine({
      init: order.state || orderState.running,
      transitions: [
        { name: 'finish', from: orderState.running, to: orderState.finished },
        { name: 'reject', from: orderState.running, to: orderState.rejected },
        { name: 'delete', from: [ orderState.finished, orderState.rejected ], to: orderState.deleted }
      ]
    })
  }

  // 订单流程状态机
  config.orderProcessMachine = order => {
    order = order || {}
    const orderProcessState = {
      initial: '1', // 未开始流程
      car_start: '2', // 车主发布消息
      user_select: '3', // 乘客选择乘坐
      user_start: '4', // 乘客发布消息
      car_select: '5', // 车主确认
      user_pay: '6', // 用户付款
      finished: '7' // 车主确认后付款完成
    }
    return new StateMachine({
      init: order.state || orderProcessState.initial,
      transitions: [
        { name: 'carStart', from: orderProcessState.initial, to: orderProcessState.car_start },
        { name: 'userStart', from: orderProcessState.initial, to: orderProcessState.user_start },
        { name: 'userSelect', from: orderProcessState.car_start, to: orderProcessState.user_select },
        { name: 'carSelect', from: [ orderProcessState.user_select, orderProcessState.user_start ], to: orderProcessState.car_select },
        { name: 'uesrPay', from: orderProcessState.car_select, to: orderProcessState.user_pay },
        { name: 'finish', from: orderProcessState.user_pay, to: orderProcessState.finished }
      ]
    })
  }

  return config
}
