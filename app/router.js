'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  /**
   * api请求
   */
  const api = router.namespace('/car/api')
  api.post('/login', controller.login.login)
}
