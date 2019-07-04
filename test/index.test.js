const createServer = require('../server')

describe('Web test', () => {
  let server

  // Create server before the tests
  beforeEach(async () => {
    server = await createServer()
  })

  test('GET / route works', async () => {
    server.methods.api.get = () => 1

    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(200)
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
  })

  test('GET /about route works', async () => {
    const options = {
      method: 'GET',
      url: '/about'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toEqual(200)
    expect(response.headers['content-type']).toEqual('text/html; charset=utf-8')
  })
})
