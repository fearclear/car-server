'use strict'

const private_config = require('../../config/private_config')

module.exports = {
  schedule: {
    cron: '0 0 */1 * * *',
    type: 'all'
    // immediate: true
  },
  async task(ctx) {
    const result = await ctx.app.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${private_config.wxapp.appid}&secret=${private_config.wxapp.secret}`)
    const assess_token = ctx.helper.parseWxData(result).access_token
    ctx.app.access_token = assess_token
  }
}
