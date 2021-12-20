# platziverse-mqtt

Estos serían los mensajes que yo estaría transmitiendo al servidor.

## `agent/connected`

```js
{
    agent: {
        uuid, // auto generar
        username, // definir por configuración
        name, // definir por configuración
        hostname, // obtener del sistema operativo
        pid // obtener del procesos
    }
}
```

## `agent/disconnected`

```js
{
    agent: {
        uuid
    }
}
```

## `agent/message`

```js
{
    agent,
    metrics: [
        {
            type,
            value
        }
    ],
    timestamp // generar cuando creamos el mensaje
}
```

## Implementación del servidor MQTT

> npm init

Creo que nodemon lo tengo instalado global

> npm install --save-dev standard nodemon

Los scripts en el package.json

```json
"scripts": {
    "start": "NODE_ENV=production node server.js",
    "start-dev": "DEBUG=platziverse:* nodemon server.js",
    "lint": "standard" 
}
```

> npm install --save debug mosca redis chalk

Entiendo que como mosca ya no se le está dando mantenimiento sería

> npm install --save debug aedes aedes-persistence-redis mqemitter-redis chalk

Creamos un archivo llamado server.js

```js
"use strict"

const debug = require("debug")("platziverse:mqtt")
// const mosca = require("mosca")
// const redis = require("redis")
const chalk = require("chalk")
const mq = require("mqemitter-redis")()
const persistence = require("aedes-persistence-redis")()

// const backend = {
//     type: "redis",
//     redis,
//     return_buffers: true
// }

// const settings = {
//     port: 1883,
//     backend
// }

// const server = new moca.Server(settings)

// server.on("ready", () => {
//     console.log(`${chalk.green('[platziverse-mqtt]')} Server is running`)
// })
const aedes = require("aedes")({
    mq,
    persistence
})

const server = require("net").createServer(aedes.handle)
server.listen(1883, () => {
    console.log("Server started and listening on port ", 1883)
})
```

> npm run start-dev

## Cómo recibir mensajes

```javascript
const server = new mosca.Server(settings)

server.on('clientConnected', client => {
    debug(`Client Connected: ${client.id}`)
})

server.on('clientDisconnected', client => {
    debug(`Client Disconnected: ${client.id}`)
})

server.on('published', (packet, client) => {
    debug(`Received: ${packet.topic}`)
    debug(`Payload: ${packet.payload}`)
})

server.on("error", handleFatalError)

function handleFatalError(err) {
    console.error(`${chalk.red('fatal error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1)
}

process.on("uncaughtException", handleFatalError)
process.on("unhandledRejection", handleFatalError)
```

Podemos probar con un cliente mqtt

> npm install -g mqtt
>
> npx mqtt -v 
>
> mqtt pub -t ‘agent/message’ -h localhost -m ‘{“hello”:“platziverse”}’

## Cómo integrar el servidor MQTT con la base de datos

En el package.json

```json
"dependencies": {
    "platziverse-db": "file:../platziverse-db"
}
```
> npm install

O 

> npm install ../platziverse-db

En server.js

```js
const db = require("platziverse-db")

const config = {
    database: process.env.DB_NAME || "platziverse",
    username: process.env.DB_USER || "platzi",
    password: process.env.DB_PASS || "platzi",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: s => debug(s)
  }

const server = new mosca.SErver(settings)

let Agent, Metric

server.on("ready", async () => {
    const services = await db(config).catch(handleFatalError)
    Agent = services.Agent
    Metric = services.Metric
    console.log(`${chalk.green('[platziverse-mqtt]')} Server is running`)
})
```

Reto #3: Sacar el la configuración para que sea un módulo reutilizable.

> npm run start-dev

## Cómo almacenar la información del agente y reportar el agente conectado

```javascript
// Esta es una función para hacer un parse del payload
const { parsePayload } = require("./utils")

const server = new mosca.Server(settings)
// Vamos a crear un Map() para mantener una lista de clientes
const clientes = new Map()

server.on("clientConnected", clinet => {
    // aquí va el debug
    // Meto un cliente con el client.id y la info del agente (que aún no conozco)
    clients.set(client.id, null)
})

server.on("published", async (packet, client) => {
    // aquí va el debug de received
    switch (packet.topic) {
        case "agent/connected":
        case "agent/disconnected":
            // aquí el debug del payload
            break;
        case "agent/message":
            debug(`Payload: ${packet.payload}`)
            const payload = parsePayload(packet.payload)
            if (payload) {
                payload.agent.connected = true
                let agent
                try {
                    agent = await Agent.createOrUpdate(payload.agent)
                } catch (e) {
                    return handleError(e)
                }

                debug(`Agent ${agent.uuid} saved`)

                // Notify Agent is Connected
                if (!cleints.get(client.id)) {
                    clients.set(client.id, agent)
                    server.publish({ topic: "agent/connected", payload: JSON.stringify(agent: { 
                        uuid: agent.uuid, 
                        name: agent.name, 
                        hostname: agent.hostname, 
                        pid: agent.pid, 
                        connected: agent.connected 
                    })})
                }
            }
            break;
    }
})

// Esta función no bota el proceso
function handleError (err) {
    console.error(err.message)
    console.error(err.stack)
}
```

Creamos un nuevo módulo en el proyecto llamado utils.js

```js
"use strict"

function parsePayload (payload) {
    // Si viene un buffer lo convierto en string
    if (payload instanceof Buffer) {
        payload = payload.toString('utf8')
    }

    try {
        // Trato de parsear el json pero esto puede dar un error si el objeto no es un json correctamente escrito
        payload = JSON.parse(payload)
    } catch (e) {
        // Si da error devuelve null.
        payload = null
    }

    return payload
}

module.exports = {
    parsePayload
}
```

## Cómo almacenar la información de las métricas

Después de notificar que el agente se conectó exitosamente vamos a almacenar las métricas. Para esto, recordemos que estamos recibiendo un arreglo que contiene las métricas, y vamos a iterar sobre ese arreglo, para obtener cada uno de los objetos que contiene.


```javascript
server.on("published", async (packet, client) => {
    switch (packet.topic) {
        case "agent/connected":
        case "agent/disconnected":
            // aquí el debug del payload
            break;
        case "agent/message":
            debug(`Payload: ${packet.payload}`)
            const payload = parsePayload(packet.payload)
            if (payload) {
                payload.agent.connected = true
                let agent
                try {
                    agent = await Agent.createOrUpdate(payload.agent)
                } catch (e) {
                    return handleError(e)
                }

                debug(`Agent ${agent.uuid} saved`)

                // Notify Agent is Connected
                if (!cleints.get(client.id)) {
                    clients.set(client.id, agent)
                    server.publish({ topic: "agent/connected", payload: JSON.stringify(agent: { 
                        uuid: agent.uuid, 
                        name: agent.name, 
                        hostname: agent.hostname, 
                        pid: agent.pid, 
                        connected: agent.connected 
                    })})
                }
            }

            // SEguimos aquí
            // Store Metrics
            for (let metric of payload.metrics) {
                let m 
                try {
                    m = await Metric.create(agent.uuid, metric)
                } catch(e) {
                    // Si no podemos almacenar la metrica la ignoramos
                    return handleError(e)
                }
                debug(`Metric ${m.id} saved on agent ${agent.uuid}`)
            }

            break;
    }
})

// Esta función no bota el proceso
function handleError (err) {
    console.error(err.message)
    console.error(err.stack)
}
```

> npm run start-dev
>
> mqtt publish -t 'agent/message' -m 'hello'


¿Cómo identificar cuando alguien se desconecta?

Tenemos un evento que se llama clientDisconnected. Allí vamos a obtener un agente del mapa. Cuando el cliente se desconecta vamos a ver si tenemos un agente, si lo tenemos lo podemos marcar como desconectado y almacenarlo en la base de datos.

```js
server.on('clientDisconnected', async (client) => {
    debug(`Client Disconnected: ${client.id}`)
    const agent = clients.get(client.id)
    if (agent) {
        // Mark Agent as Disconnected
        agent.connected = false
        try {
            await Agent.createOrUpdate(agent)
        } catch (e) {
            return handleError(e)
        }

        // Delete Agent from Clients List
        clients.delete(client.id)

        server.publish({
            topic: "agent/disconnected",
            payload: JSON.stringify({
                agent: {
                    uuid: agnet.uuid
                }
            })
        })

        debug(`Client (${client.id}) associated to Agent(${agent.uuid}) marked as disconnected`)
    }
})
```

> npm run lint
>
> npm run list-fix

## Probando el servidor MQTT (Ejemplo con mqtt client)

Vamos a probar que efectivamente nuestra información se esté guardando en la base de datos. El servidor MQTT es el encargado de enviar el agnetConnected y agentDisconnected.

Vamosa enviar un agentMessage y el mensaje que vamos a enviar será un objeto JSON con la información del agente y la información de las métricas. Un objeto y un un arreglo, respectivamente.

El tipo de mensaje que vamos a enviar es del tipo agent message usando el cliente mqtt

> mqtt pub -t 'agent/message' -m '{"agent": {"uuid": "yyy", "name": "platzi", "username": "platzi", "pid": 10, "hostname": "platzibogota"}, "metrics": [{"type": "memory", "value": "1001"}, {"type": "temp", "value": "33"}]}'

Nos conectamos a la base de datos para hacer unas consultas

> psql -U platzi platziverse
>
> select * from agents;
>
> select * from metrics;
>
> \quit

¿Qué pasa si vuelvo a mandar el mensaje? El agente sigue siendo el mismo pero ahora las metricas las tengo dos veces. 

Si enviamos el mensaje con otro uuid entonces crea otro agente y otras metricas.

Reto # 4: Actualmente las métricas se almacenan en serie en la base de datos. Refactorizar apra que se almacenen en paralelo. Promesas en paralelo.
