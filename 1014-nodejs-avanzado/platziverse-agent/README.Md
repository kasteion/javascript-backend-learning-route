# platziverse-agent

## Usage

```js
const PlatziverseAgent = require("platziverse-agent")

// Para que cada 2000 ms envie un mensaje
const agent = new PlatziverseAgent({
    interval: 2000
})

agent.connect()

// Estos eventos son de este agente únicamente
agent.on("connected", handler)
agent.on("disconnected", handler)
agent.on("message", handler)

// Esos eventos son de otros agentes que están enviando al mqtt server
agent.on("agent/connected", handler)
agent.on("agent/disconnected", handler)
agent.on("agent/message", payload => {
    console.log(payload)
}) 

setTimeout(() => agent.disconnect(), 20000)
```

## Cómo implementar un custom EventEmitter usando ES6 classes

Creamos un archivo index.js

```js
"use strict"

const EventEmitter = require("events")

class PlatziverseAgent extends EventEmitter {
    constructor() {
        supper()
    }
}

module.exports = PlatziverseAgent
```

> node
>
> const PlatziverseAgent = require("./")
>
> const agent = new PlatziVerseAgent()

Le ponemos un listener

> agent.on("agent/message", console.log)
>
> agent.emit("agent/message", "This is the message")

## Definiendo un timer de ejecución continua (setInterval)
## Cómo implementar un custom EventEmitter usando ES6 classes


Creamos un archivo index.js

```js
"use strict"

const EventEmitter = require("events")

class PlatziverseAgent extends EventEmitter {
    constructor() {
        supper()
    }
}

module.exports = PlatziverseAgent
```

> node
>
> const PlatziverseAgent = require("./")
>
> const agent = new PlatziVerseAgent()

Le ponemos un listener

> agent.on("agent/message", console.log)
>
> agent.emit("agent/message", "This is the message")

## Definiendo un timer de ejecución continua (setInterval)

> npm install --save-dev standard

```
"lint": "standard"
"lint-fix": "standard --fix"
```


```js
"use strict"

const EventEmitter = require("events")

class PlatziverseAgent extends EventEmitter {
    // Aquí vamos a recibir las opts
    constructor(opts) {
        supper()
        this._options = opts
        // Propiedad para ver si nicio
        this._started = false}
        // Una propiedad para el timer
        this._timer = null
    }

    connect() {
        if (!this._started) {
            this._started = true
            this.emit("connected")
            const opts = this._options
            this._timer = setInterval(() => {
                this.emit("agent/message", "this is a message")
            }, ops.interval)
        }
    }

    disconnect() {
        if (this._started) {
            clearInterval(this._timer)
            this._started = false
            this.emit("disconnected")
        }
    }
}

module.exports = PlatziverseAgent
```

> node
>
> const PlatziverseAgent = require("./")
>
> cons agent = new PlatziverseAgent({ interval: 2000 })
>
> agent.on("agent/message")
>
> agents.connect()
>
> agents.disconnect()

## Implementación del cliente MQTT

El agente se va a conectar al cliente MQTT para publicar métricas y para recibir información.

(Defaults es para definir las opciones por defecto que va a tener nuestro agente cuando lo inicialicemos)

> npm i --save mqtt debug defaults

Nosotros vamos a poder ejecutar el agente de dos formas, en modo lectura (sin configuración) y en modo de escritura.

```js
"use strict"

// 1. Requerimos nuestras dependencias
const debug = require("debug")("platziverse:agent")
const mqtt = require("mqtt")
const defaults = require("defaults")
// Esto ya estaba
const EventEmitter = require("events")

// 2. Definimos las opciones por defecto

const options = {
    name: "untitled",
    username: "platzi",
    interval: 5000,
    mqtt: {
        host: "mqtt:/localhost"
    }
}
class PlatziverseAgent extends EventEmitter {
    constructor(opts) {
        supper()
        // 3. Cambiamos aquí que ecibimos las opts o el default
        // this._options = opts
        this._options = defaults(opts, options)
        this._started = false
        this._timer = null
        // 4. Creamos una referencia al cliente
        this._client = null

    }

    connect() {
        if (!this._started) {
            
            const opts = this._options
            // 5. Aquí conectamos nuestro cliente
            this._client = mqtt.connect(opts.mqtt.host)
            this._started = true

            // 6. Suscribimos el cliente a los mensajes que queremos escuchar
            this._client.subscribe("agent/message")
            this._client.subscribe("agent/connected")
            this._client.subscribe("agent/disconnected")

            // 7. El cliente mqtt tiene un evento de connect para indicarnos que el cliente se ha conectado
            this._client.on("connect", () => {
                // Aquí dentro movemos el emit de connected y el timer para que esto se haga cuando el cliente esté conectado al mqtt server
                this.emit("connected")
                
                this._timer = setInterval(() => {
                    this.emit("agent/message", "this is a message")
                }, ops.interval)
            })

            // 8. También tiene un evento message para cuando recibe un mensaje.
            this._client_.on("message", (topic, payload) => {

            })

            // 9. También tiene el evento error para indicar que tiene un error.
            this._client.on("error", () => this.disconnect())
        }
    }

    disconnect() {
        if (this._started) {
            clearInterval(this._timer)
            this._started = false
            this.emit("disconnected")
        }
    }
}

module.exports = PlatziverseAgent
```

Vamos a utilizar el parsePayload que se creo en platziverse-mqtt (Así que podríamos copiar el archivo)

Vamos a necesitar generar un uuid único, para esto vamos a usar el módulo uuid

> npm install --save uuid

```js
// 1. Requerimos uuid
const uuid = require("uuid")
// 2. Requerimos el parsePayload de utils
const { parsePayload } = require("./utils")

class PlatziverseAgent extends EventEmitter {
    constructor(opts) {
        supper()
        this._options = defaults(opts, options)
        this._started = false
        this._timer = null
        this._client = null
        // 3. Vamos a necesitar una referencia al agentId
        this._agentId = null
    }

    this._client.on("connect", () => {
        // 4. Cuando ya se que me he conectado exitosamente genero un uuid único para identificar el agente.
        this._agentId = uuid.v4()
        // 5. Y lo voy a colocar en el agentId 
        this.emit("connected", this._agentId)
        this._timer = setInterval(() => {
            this.emit("agent/message", "this is a message")
            }, ops.interval)
    })

    this._client.on("message", (topic, payload) => {
        payload = parsePayload(payload)

        let broadcast = false
        switch(topic) {
            case "agent/connected":
            case "agent/disconnected":
            case "agent/message":
                broadcast = payload && payload.agent && payload.agent.uuid !== this._agentId

        }´´

        if (broadcast) {
            this.emit(topic, payload)
        }
    })
}
```

Este sería un agente de retransmisión de mesajes.

## Implementación de métricas personalizadas

Por el momento no sabemos que métricas vamos a transmitir y como queremos que sea flexible (Puede ser memoria, temperatura, etc)

Digamos que al agente le podamos pasar las métrica para obtener el rss del memory usage.

```js
agent.addMetric("rss", function getRss() {
    return process.memoryUsage().rss
}) 
```

Pero que tal si le queremos pasar otra métrica que utiliza una función asíncrona para obtener el dato. Esto podríamos hacerlo así.

```js
agent.addMetric("promiseMetric", function getRandomPromise() {
    return Promise.resolve(Math.random())
})
```

Y si quiseramos soportar callbacks entonces podríamos hacerlo así:

```js
agent.addMetric("callbackMetric", function getRandomCallback(callback) {
    setTimeout(() => {
        callback(null, Math.random())
    }, 1000)
})
```

Entonces necesito implementar algo que me permita utilizar estos tres tipos de funciones y devolver un valor.

```js
// 0. Requiero el módulo os porque voy a hacer un os.hostname()
const os = require("os")
// 0. Vamos a utilizar promisify para trnasformar de callback pattern a promesas
const util = require("util")

class PlatziverseAgent extends EventEmitter {
    constructor(opts) {
        supper()
        this._options = defaults(opts, options)
        this._started = false
        this._timer = null
        this._client = null
        this._agentId = null
        // 1. Manejamos las metricas como un Map
        this._metrics = new Map()
    }


    // 2. Creamos la función para añadir metricas
    addMetric(type, fn) {
        this._metrics.set(type, fn)
    }

    // 3. Y una función para eliminar metricas
    removeMetric(type) {
        this._metrics.delete(type)
    }

    this._client.on("connect", () => {
        this._agentId = uuid.v4()
        this.emit("connected", this._agentId)
        this._timer = setInterval( async () => {
            // 4. Solo voy a hacer algo si tengo metricas para enviar 
            if (this._metrics.size > 0) {
                // Mas o menos el mensaje que voy a enviar pero sin metricas...
                let message = {
                    agent: {
                        uuid: this._agentId,
                        username: opts.username,
                        name: opts.name,
                        hostname: os.hostname() || 'localhost',
                        pid: process.pid
                    },
                    metrics: [],
                    timestamp: new Date().getTime()
                }

                for (let [metric, fn] of this._metrics) {
                    if (fn.length === 1) {
                        fn = util.promisify(fn)
                    }

                    message.metrics.push({
                        type: metric,
                        value: await Promise.resolve(fn())
                    })
                }

                debug("Sending", message)

                this.__client.publish("agent/message", JSON.stringify(message))
                this.emit("message", message")
            }


            // Esto se va...this.emit("agent/message", "this is a message")
            }, ops.interval)
    })

    disconnect() {
        if (this._started) {
            clearInterval(this._timer)
            this._started = false
            // Faltaba este par de lineas en el disconnect para manejar efectivamente la desconexión.
            this.emit("disconnected", this._agentId)
            this._client.end()
        }
    }
}
```

## Probar agent (ejemplo)

Creamos una carpeta examples y un archivo examples/index.js
```js
const PlatziverseAgent = require("../")

cons agent = new PlatziverseAgent({
    name: "myapp",
    username: "admin",
    interval: 2000
})

agent.addMetric("rss", function getRss() {
    return process.memoryUsage().rss
})

agent.addMetric("promiseMetric", function getRandomPromise() {
    return Promise.resolve(Math.random())
})

agent.addMetric("callbackMetric", function getRandomCallback(callback) {
    setTimeout(() => {
        callback(null, Math.random())
    }, 1000)
})

agent.on("connected", handler)
agent.on("disconnected", handler)
agent.on("message", handler)
agent.on("agent/connected", handler)
agent.on("agent/disconnected", handler)
agent.on("agent/message", handler) 

function handler (payload) {
    console.log(payload)
}
setTimeout(() => agent.disconnect(), 10000)
```