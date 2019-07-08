module.exports = {
  method: 'GET',
  path: '/govuk/{route*}',
  options: {
    handler: async (request, h) => {
      const route = request.params.route
      const data = await request.server.methods.api.get(route)
      let body = ''
      if (data.details.body) {
        body = body + data.details.body
      }
      if (data.details.parts) {
        body = data.details.parts.reduce((bod, part) => {
          console.log(part)
          return bod + `<h1 class="part-title" name="${part.slug}">${part.title}</h1><p class="govuk-body">${part.body}</p>`
        }, body)
      }
      console.log(data)
      return h.view('govuk', {
        title: data.title,
        body: body
      })
    }
  }
}
