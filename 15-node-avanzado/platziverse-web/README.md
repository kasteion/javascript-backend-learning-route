# platziverse-web

## Implementación de un servidor web estático con express

Creamos el archivo server.js

```js
"use strict"
const debug = require("debug")("platziverse:web")
const http = require("http")
const express = require("express")
const chalk = require("chalk")

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)

server.listen(port, () => {
    console.log(`${chalk.green("[platziverse-web]")} Server listening on port ${port}`)
})
```

Creamos los scripts en el package.json

```json
"scripts": {
    "start": "NODE_ENV=production node server.js",
    "start-dev": "DEBUG=plaztiverse:* nodemon server.js",
    "lint": "standard",
    "lint-fix": "standard --fix"
}
```

> npm run start-dev

Vamos a ver como crear un servidor estático con express...

> mkdir public
>
> touch public/index.html

En el directorio public vamos a colocar todo lo sea estático (html, css, imágenes)

Express tienen un middleware que se llama express.static.

```js
const path = require("path")

app.use(express.static(path.join(__dirname, "public")))

function handleFatalError (err) {
    console.error(`${chalk.red('[fatal error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1)
}

process.on("uncaughtException" handleFatalError)
process.on("unhandledRejection", handleFatalError)

server.listen(port, () => { /*...*/ })
```

## Integrando socket.io con express

Vamos a utilizar web sockets en nuestro proyecto. En nuestra aplicación queremos retransmitir a nuestra aplicación web data en tiempo real. Vamos a utilizar socket.io

> npm install socket.io --save

Y de nuevo en server.js

```js
// Requerimos socket io
const socketio = require("socket.io")

// esta linea ya estaba 
const server = http.createServer(app)
// Creamos la instacia de socket.io pasandole la instancia del server que habíamos creado.
const io = socketio(server)

// Esta linea ya estaba
app.use(express.static(path.join(__dirname, "public")))

io.on("connect", socket => {
    debug(`Connected ${socket.id}`)
})
```

Y en el index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platziverse</title>
    <script type="text/javascript" src="/socket.io/socket.io.js"> // Este es el script... que me crea la integración de socket.io con node.js</script>
</head>
<body>
    <h1>Platziverse</h1>
    <script type="text/javascript">
        // Y con esto connecto el cliente al socket...
        var socket = io()

        socket.on("agent/message", function (payload) {
            // En el cliente para recibir mensajes del servidor
            console.log(payload)
        })

        setTimeout(function() {
            // Y estos mensajes se los envío al server.
            socket.emit("agent/message", "hello server!")
        }, 5000)
    </script>
</body>
</html>
```

Entonces ya podemos seguir en el server.js

```js
io.on("connect", socket => {
    debug(`Connected ${socket.id}`)

    socket.on("agent/message", payload => {
        // Y estos son mensajes que le llegan al servidor
        console.log(payload)
    })

    setInterval(() => {
        // Estos son mensajes que le llegan al cliente
        socket.emit("agent/message", { agent: "xxx-yyy"})
    }, 2000)
})
```

## Integrando agente de monitoreo con socket.io

Primero tenemos que referenciar platziverse-agent como un módulo local en nuestro package.json

```json
"dependencies": {
    "platziverse-agent": "file:../platziverse-agent"
}
```

Y luego en server.js

```js
// Requerimos platziverse agent
const PlatziverseAgent = require("platziverse-agent")

//...
const io = sockeio(server)
// Creamos la instacia del agente
const agent = new PlatziverseAgent()

io.on("connect", socket => {
    debug(`Connected ${socket.id}`)

    // Cada vez que en el agente recibo un mensaje le envío al cliente un mensaje con el payload reenviandole la data del agente al cliente web.
    agent.on("agent/message", payload => {
        socket.emit("agent/message"), payload)
    })

    // Lo recibo del agente, lo mando al cliente
    agent.on("agent/connected", payload => {
        socket.emit("agent/connected"), payload)
    })

    // Lo recibo del agente, lo mando al cliente
    agent.on("agent/disconnected", payload => {
        socket.emit("agent/disconnected"), payload)
    })
})

// ...
server.listen(port, () => {
    console.log(`${chalk.green("[platziverse-web]")} Server listening on port ${port}`)
    // Cuando el servidor ya está corriendo entonces conecto el agente
    agent.connect()
})
```

Y también en el index.html

```html
<script type="text/javascript">
        // Y con esto connecto el cliente al socket...
        var socket = io()

        socket.on("agent/message", function (payload) {
            // En el cliente para recibir mensajes del servidor
            console.log(payload)
        })

        socket.on("agent/connected", function (payload) {
            // En el cliente para recibir mensajes del servidor
            console.log(payload)
        })

        socket.on("agent/disconnected", function (payload) {
            // En el cliente para recibir mensajes del servidor
            console.log(payload)
        })

        // setTimeout(function() {
        //     // Y estos mensajes se los envío al server.
        //     socket.emit("agent/message", "hello server!")
        // }, 5000)
</script>
```

Iniciamos el web client

> npm run start-dev

Iniciamos el agente

> cd ../platziverse-agent/
>
> node examples/index.js

Iniciamos el mqtt server

> cd ../platziverse-mqtt
>
> npm run start-dev

Creamos una archivo utils.js

utils.js

```js
"use strict" 

function pipe(source, target) {
    if (!source.emit || !target.emit) {
        throw TypeError(`Please pass EventEmitter's as arguments`)
    }

    const emit = source._emit = source.emit

    source.emit = function () {
        emit.apply(source, arguments)
        target.emit.apply(target, arguments)
        return source
    }
}

module.exports = { pipe }
```

Entonces en el servidor

```js
const { pipe } = require("./utils")

io.on("connect", socket => {
    debug(`Connected ${socket.id}`)

    // En lugar de esto
    // agent.on("agent/message", payload => {
    //     socket.emit("agent/message"), payload)
    // })
    // agent.on("agent/connected", payload => {
    //     socket.emit("agent/connected"), payload)
    // })
    // agent.on("agent/disconnected", payload => {
    //     socket.emit("agent/disconnected"), payload)
    // })
    pipe(agent, socket)
})
```
## Implementación de rutas proxy con la API

Esta plataforma web se va a conectar al API para obtener cierta información, primero la información historica desde el API y luego información en tiempo real. 

Vamos a implementar un proxy para no compartir nuestros API keys en el cliente. Estas peticiones las vamos a hacer desde el lado del servidor (desde el javascript que corre en el browser) y las peticiones a nuestro proxy desde el cliente.

Creamos un archivo proxy.js

```js
"use strict"
const express = require("express")

const api = express.Router()

api.get("/agents", (req, res) => {})

api.get("/agents/:uuid", (req, res) => {})

api.get("/metrics/:uuid", (req, res) => {})

api.get("/metrics/:uuid/:type", (req, res) => {})

module.exports = api
```

Y esto lo montamos en nuestro servidor despues del middleware estático en server.js

```js
// Requerimos proxy
const proxy = require("./proxy")

app.use(express.static(path.join(__dirname, "public")))
// Montado en / como que fueran rutas nativas de nuestra aplicación
app.use("/", proxy)
```

> npm install --save axios express-asyncify

Y en proxy.js

```js
"use strict"
const express = require("express")
const asyncify = require("asyncify")
const axios = require("axios")

const { endpoint, apiToken } = require("./config")
const api = asyncify(express.Router())
// En el server.js tambien hay que hacer const app = asyncify(express())

api.get("/agents", async (req, res, next) => {
    const options = {
        method: "post",
        url: `${endpoint}/api/agents`,
        headers: { "Authorization": `Bearer ${apiToken}`}
    }
    let result
    try {
        result = await axios(options)
    } catch (err) {
        return next(err) // Habría que implementar el middleware de manejo de errores en server.js
    }

    res.send(result)
})

api.get("/agents/:uuid", async (req, res) => {})

api.get("/metrics/:uuid", async (req, res) => {})

api.get("/metrics/:uuid/:type", async (req, res) => {})

module.exports = api
```

Aquí queremos enfatizar el concepto de backend for frontend. 

Creamos un archivo de configuración config.js

```js
"use strict"

module.exports = {
    endpoint: process.env.API_ENDPOINT || "http://localhost:3000",
    apiToken: process.env.API_TOKEN || "token por defecto"
}
```

En platziverse-api

> node
>
> var auth = require("./auth")
>
> auth.sign({ username: "platzi", admin: true, permissions: ['metrics:read']}, "platzi, console.log)

Nos da el token por defecto...

## Presentación de nuestro cliente frontend en Vue.js

El cliente es un proyecto en vue js que utiliza chart.js para mostrar gráficas. El cliente debería estar en una carpeta /platziverse-web/client y debería compilarse a un bundle.js que se coloca en public...

En el index de public pues ya se utiliza este bundle.js

## Integración del cliente frontend con API (Metric)

El cliente de metric es el encargado de visualizar las metricas en pantalla. Cuando visualizamos el componente de metrics hacemos una petición al servidor. El servidor utiliza dos variables, el uuid y type.

Moment es para visualizar fechas

> npm install --save moment

Un módulo para generar un color aleatorio por facilidad.

> npm install --save random-material-color

```js
const axios = require("axios")
const moment = require("moment")
const randomColor = require("random-material-color")

initialize() {
const { uuid, type } = props
this.color = randomColor.getColor()

const options = {
    method: 'GET',
    url: `http://localhost:8080/metrics/${uuid}/${type}`
}

let result
try {
    result = await request(options)
} catch(err) {
    // Imprimir error en pantalla
    this.error = err.error.error
    return
}

const labels = []
const data = []

if (Array.isArray(result)) {
    result.forEach(m => {
        labels.push(moment(m.createdAt).format("HH:mm:ss"))
        data.push(m.value)
    })

    // Estas serían las métricas de nuestro componente
    this.datacollection = {
        labels,
        datasets: [{
            backgroundColor: this.color,
            label: type,
            data
        }]
    }
}
}
```

1. Ejecutar la api ( En platziverse-api )

> npm run start-dev

2. Ejecutar el servidor de mqtt ( En platziverse-mqtt )

> npm run start-dev

2. Ejecutar el agente de ejemplo ( En platziverse-agent )

> node example/agent.js 

Y el componente de metric deberíamos ejecutarlo algo como:

```jsx
<metric uuid="el-uuid-del-agent" type="promiseMetric" />
```

Esto es a la api, luego sería de integrarlo al real time.

## Integración del cliente frontend con socket.io (Metric)

> npm install --save socket.io-client 

```js
const io = require("socket.io-client")
// El socket será de nuestro componente de aplicación para pasarlo a los demás componentes por props
const socket = io()
```

Y en el componente metric

```js
startRealtime() {
    const { type, uuid, socket } = this.props;
    socket.on("agent/message", payload => {
        if (payload.agent.uuid === uuid){
            const metric = payload.metrics.find(m => m.type === type)

            const labels = this.datacollection.labels
            const data = this.datacollection.datasets[0].data

            const length = lables.length || data.length

            if (length >= 20 ){
                // Elimina el primer elemento del arreglo
                labels.shift()
                data.shift()
            }

            // Agrega nuevo elementos al arreglo
            labels.push(moemnt(metric.createdAt).format("HH:mm:ss"))
            data.push(metric.value)

            // Esto dependería es como para dar una idea de que debemos pasar a nuestra grafica la collection de data
            this.datacollection = {
                labels,
                datasets: [{
                    backgroundColor: this.color,
                    lable: type,
                    data
                }]
            }
        }
    })
}
```

```jsx
<metric uuid="the-uuid-of-the-agent" type="callbackMetric" socket={socket}/>
```

## Integración del cliente frontend con API (Agent)

El componente de agente le paso el uuid y este obtiene los datos del agente (nombre, hostname, conectando, id de proceso, etc) y vamos a preguntar que métricas tiene ese agente y visualizar las métricas de una vez...algo como:

```js
const axios = require("axios")

function async initialize() {
    const { uuid } = props
    const options = {
        method: "GET",
        url: `http://localhost:8080/agent/${uuid}`,
        json: true
    }

    let agent
    try {
        agent = await axios(options)
    } catch (err) {
        this.error = e.error.error
        return
    }

    this.name = agent.name
    this.hostname = agent.hostname
    this.connected = agent.connected
    this.pid = agent.pid

}

function async loadMetrics() {
    // Obtenemos cuales son las métricas que tiene el agente
    const { uuid } = props
    const options = {
        method: "GET",
        Url: `http://localhost:8080/metrics/${uuid}`,
        json: true
    }
    let metrics
    try {
        metrics = await axios(options)
    } catch (err) {
        this.error = e.error.error
        return
    }

    this.metrics = metrics
}
```

Recordemos que el socket está en el app y se lo pasamos al componente de agent y el componente de agent tiene dentro un componente metric al cual le pasa también el socket. Para tener solo una instancia del socket.

## Integración del cliente frontend con socket.io (Agent)

Componente Agent --> Api --> Socket.io

Cuando el agente se conecta queremos agregarlo al frontend automáticamente y cuando se desconecta mostrar el estado conectado/desconectado.

```js
// El socket viene como una prop del componente

function startRealTime() {
    const { uuid, socket } = this.props
    socket.on("agent/disconnected", payload => {
        if (payload.agent.uuid === uuid) {
            this.connected = false
        }
    })
}
```

```jsx
<agent uuid="el-uuid-del-cliente" socket={socket} />
```

Lo otro sería en el app.js para que monte componentes conforme los va viendo conectados...

```js
const axios = require("axios")
const io = require("socket.io-client")
const socke = io()

function async initialize() {
    const options = {
        method: "GET",
        url: "http://localhost:8080/agents",
        json: true
    }

    let result
    try {
        result = await axios(options)
    } catch (e) {
        this.error = e.error.error
        return
    }

    this.agents = result

    socket.on("agent/connected", payload => {
        const { uuid } = payload.agent
        const existing = this.agents.find(a => a.uuid === uuid)
        if (!existing) {
            this.agents.push(payload.agent)
        }
    })
}
```