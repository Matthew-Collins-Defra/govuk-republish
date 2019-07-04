const createServer = require('./server')

createServer()
  .then(server => server.start())
  .catch(err => {
    console.log('Exiting with error: ' + err)
    process.exit(1)
  })
