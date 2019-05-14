'use strict'

module.exports = () => {
  return async function response(ctx, next) {
    try {
      await next()
      let body = ctx.body
      if(body && ctx.path.indexOf('car/api') > -1) {
        if(ctx.status === 200) {
          ctx.status = body.status ? body.status : 200
        }
        if(body instanceof Array) {
          body = {
            list: body
          }
        }
        if(typeof body === 'string') {
          body = {
            text: body
          }
        }
        if(ctx.status === 200) {
          body = {
            success: true,
            ...body
          }
        }else {
          body = {
            success: false,
            text: body.text
          }
        }
        ctx.body = body
      }
    } catch (err) {
      // 系统抛出的错误处理，可以将其记录到错误日志中
      ctx.app.emit('error', err, ctx)
      const status = err.status || 500
      const error = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : err.message
      ctx.body = { text: error, success: false }
      // 422表单验证错误请求处理
      if(status === 422) {
        ctx.body.detail = err.errors
        if(err.errors instanceof Array) {
          ctx.body.text = err.errors[0].message
        }
      }
      ctx.status = status
    }
  }
}

