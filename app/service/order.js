'use strict'

const Service = require('egg').Service

class OrderService extends Service {
  async getBusinessInfo(business) {
    business = business || {}
    const params = {
      businessId: business.businessId
    }
    return await this.app.mysql.get('business_info', params)
  }
}

module.exports = OrderService
