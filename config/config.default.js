'use strict'
const private_config = require('./private_config')

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

  return config
}
