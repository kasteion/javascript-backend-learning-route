const Hapi = require('@hapi/hapi')

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost'
})

const init = async () => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      // return "Hola mundo..."
      return h.response('Hola mundo...').code(200)
    }
  })

  server.route({
    method: 'GET',
    path: '/redirect',
    handler: (request, h) => {
      return h.redirect('https://platzi.com')
    }
  })

  try {
    await server.start()
    console.log('Server running on %s', server.info.uri)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

init()
