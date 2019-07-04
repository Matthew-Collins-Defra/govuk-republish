const hapi = require('hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('inert'))
  await server.register(require('./plugins/api'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/graceful-stop'))
  await server.register(require('./plugins/views'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  // Register router (must come after views plugin)
  await server.register(require('./plugins/router'))

  return server
}

module.exports = createServer
