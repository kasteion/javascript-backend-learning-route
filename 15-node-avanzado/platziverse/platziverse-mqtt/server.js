const aedes = require('aedes')()
const debug = require('debug')('platziverse:mqtt')
const chalk = require('chalk')
const server = require('net').createServer(aedes.handle)

const port = 1883

aedes.on('client', (client) => {
  debug(`Client Connected: ${client.id}`)
})

aedes.on('clientDisconnect', (client) => {
  debug(`Client Disconnected: ${client.id}`)
})

aedes.on('publish', (packet, client) => {
  debug(`Received: ${ packet.topic }`)
  debug(`Payload: ${ packet.payload }`)
})

server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-mqtt]:')} Server started and listening on port `, port)
  })