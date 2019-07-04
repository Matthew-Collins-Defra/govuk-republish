const request = require('request-promise-native')
const config = require('../config')

module.exports = {
  plugin: {
    name: 'api',
    register: (server) => {
      server.method({
        name: 'api.get',
        method: (action) => request({
          json: true,
          uri: config.apibase + action
        }),
        options: {}
      })
    }
  }
}
