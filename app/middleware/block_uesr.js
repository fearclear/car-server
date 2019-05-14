'use strict'

module.exports = () => {
  return async function blockUser(ctx, next) {
    if(ctx.path === '/signout') {
      await next()
      return
    }
    if(ctx.user && ctx.user.is_block && ctx.method !== 'get') {
      ctx.status = 403
      ctx.body = '您已被管理员屏蔽了，有疑问请联系fearcleari@gmail.com'
      return next()
    }
    await next()
  }
}
