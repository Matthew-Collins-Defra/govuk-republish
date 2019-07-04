module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      const data = await request.server.methods.api.get('viewcount')

      return h.view('home', {
        title: 'ELM Land Management Plan',
        viewcount: data.viewcount
      })
    }
  }
}
