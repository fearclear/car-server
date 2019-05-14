'use strict'

const Schema = require('async-validator')

module.exports = {
  validator(descriptor, data) {
    const schema = new Schema(descriptor)
    return new Promise(resolve => {
      schema.validate(data, errors => {
        if(errors) {
          this.throw(422, 'Invalid data', {
            errors
          })
        }
        resolve(errors)
      })
    })
  }
}
