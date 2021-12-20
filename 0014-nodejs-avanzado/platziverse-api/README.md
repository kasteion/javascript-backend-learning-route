# platziverse-api

## Implementación de un servidor básico con express

En server.js

```js
"use strict"

const hptt = require("http")
const chalk = require("chalk")
const express = require("express")

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
})
```

## Definición de rutas del API

Creamos un nuevo archivo llamado api.js

```js
"use strict"

const debug = require("debug")("platziverse:api:routes")
const express = require("express")

const api = express.Router()

api.get("/agents", (req, res) => {
    res.send({})
})

api.get("/agents/:uuid", (req, res) => {
    const { uuid } = req.params
    res.send({ uuid })
})

api.get("/metrics/:uuid", (req, res) => {
    const { uuid } = req.params
    res.send({ uuid })
})

api.get("/metrics/:uuid/:type", (req, res) => {
    const { uuid, type } = req.params
    res.send({ uuid, type })
})

module.exports = api
```

En server.js

```js
"use strict"

const hptt = require("http")
const chalk = require("chalk")
const express = require("express")

// 1. Requiero las rutas
const api = require("./api")

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

// 2. Utilizando middleware de express
app.use("/api", api)

server.listen(port, () => {
    console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
})
```

## Implementación de manejo de errores con express

Para manejar errores con express utilizamos el mismos sistema de middleware, los middlewares se ejecutan de forma secuencial. (El middleware de manejo de errores va despues de las rutas)

```js
const debug = require("debug")

app.use("/api", api)

app.use((err, req, res, next) => {
    debug(`Error: ${err.message}`)
    if (err.message.match(/not found/)) {
        return res.statu(404).send({error: err.message })
    }

    res.status(500).send({error: err.message })
})

function handleFatalError (err) {
    console.error(`${chalk.red('[fatal error]')} ${err.message}`)
    console.error(err.stack)
    process.exit(1)
}

process.on("uncaughtException", handleFatalError)
process.on("unhandledRejection", handleFatalError)
```

Entonces desde el api.js podría lanzar errores así:

```js
api.get("/agent/:uuid", (req, res, next) => {
    const { uuid } = req.params
    if (uuid !== 'yyy') {
        return next(new Error("Agent not found"))
    }
    res.send({ uuid })
})
```

El Reto sería implementar custom errors para agent not found, not authorized, not authenticated ...

## Pruebas básicas de integración con Ava y supertest

Instalamos ava y supertest como dependencias de desarrollo

> npm install --save-dev ava supertest

Creamos un directorio llamado tests y dentro un archivo tests/api-test.js

Creamos un script de test en el package.json

```json
"scripts": {
    "test": "DEBUG=platziverse:* ava tests/ --verbose"
}
```

En api.test.js

```js
"use strict"

const test = require("ava")
const request = require("supertest")

// serial es para hacer los tests de forma serial
// cb Para probar funciones de tipo callback
test.serial.cb("/api/agents", t => {
    // Tenemos que enviarle request con una instancia de la función que vamos a probar.
    request()
})
```

Tenemos que hacer algo para que si el server.js lo utilizamos en un require los exporte y si no pues lo ejecute con el listen. El server.js

```js
// Si no lo estoy llamando con require lanzo el servidor
if (!module.parent) {
    process.on("uncaughtException", handleFatalError)
    process.on("unhandledRejection", handleFatalError)
    
    server.listen(port, () => {
        console.log(`${chalk.green('[platziverse-api]')} server listening on port ${port}`)
    })
}

// Si lo estoy llamando con require entonces lo exporta
module.exports = server
```

Ahora sí seguimos con las pruebas

```js
const server = require("../server")

test.serial.cb("/api/agents", t => {
    // Tenemos que enviarle request con una instancia de la función que vamos a probar.
    request(server)
        .get("/api/agents")
        .expect(200)
        .expect('Contet-Type', /json/)
        .end((err, res) => {
            t.falsey(err, "Should not return an error")
            let body = res.body
            t.deepEqual(body, {}, "response body should be the expected")
            // Esto es para indicar que la prueba terminó y solo lo necesito en las pruebas de tipo cb (callbacks)
            t.end()
        })
})
```

> npm test

## Integración con el módulo de base de datos

En el package.json

```json
"dependencies": {
   "platziverse-db": "file:../platziverse-db" 
}
```

> npm install

Para utilizar el módulo de base de datos.


Creamos un archivo de configuración config.js

```js
"use strict"

const debug = require("debug")("platzivers:api:db")

module.exports = {
    db: {
        database: process.env.DB_NAME || "platziverse",
        username: process.env.DB_USER || "platzi",
        password: process.env.DB_PASS || "platzi",
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        logging: s => debug(s),
    }
}
```

> npm install --save express-asyncify

Luego en el archivo de api.js

```js
"use strict"

const debug = require("debug")("platziverse:api:routes")
const express = require("express")
// 1. Requerimos el módulo express-asyncify
const asyncify = require("express-asyncify")
// 2. Requerimos el módulo de base de datos
const db = require("platziverse-db")

// 3. Requerimos el archivo de configuración
const config = require("./config")

// 4. Envuelvo el router en asyncify
// Esto tambien hay que hacerlo en el server.js en lugar de const app = express() va const app = asyncify(express())
const api = asyncify(express.Router())

// 5. Voy a mantener una instancia del servicio, Agente y Metrica
let service, Agent, Metric

api.use("*", async (req, res, next) => {
    if (!services) {
        debug("Connecting to database")
        try {
            services = await db(config.db)
        } catch (err) {
            return next(err)
        }
        Agent = services.Agent
        Metric = service.Metric
    }
    next()
})

api.get("/agents", (req, res) => {
    res.send({})
})

api.get("/agents/:uuid", (req, res) => {
    const { uuid } = req.params
    res.send({ uuid })
})

api.get("/metrics/:uuid", (req, res) => {
    const { uuid } = req.params
    res.send({ uuid })
})

api.get("/metrics/:uuid/:type", (req, res) => {
    const { uuid, type } = req.params
    res.send({ uuid, type })
})

module.exports = api
```
## Implementación de ruta del API

Ya hemos integrado nuestro proyecto con el módulo platziverse db. Ahora vamos a integrar con las rutas de API. 

```js
api.get("/agents", async (req, res, next) => {
    debug("A request has come to /agents")
    let agents = []
    try {
        agents = await Agent.findConnected()
    } catch (e) {
        return next(e)
    }
    res.send(agents)
})

api.get("/agents/:uuid", async (req, res, next) => {
    const { uuid } = req.params
    debug(`request to /agents/${uuid}`)
    let agent
    try {
        agent = await Agent.findByUuid(uuid)
    } catch (err) {
        return next(err)
    }
    
    if (!agent) {
        return next(new Error(`Agent not found with uuid ${uuid}`))
    }

    res.send( agent )
})

api.get("/metrics/:uuid", async (req, res, next) => {
    const { uuid } = req.params
    debug(`request to /metrics/${uuid}`)
    let metrics = []
    try {
        metrics = await Metric.findByAgentUuid(uuid)
    } catch (err) {
        return next(err)
    }

    if (!metrics || metrics.length === 0) {
        return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
    }
    res.send({ uuid })
})

api.get("/metrics/:uuid/:type", async (req, res, next) => {
    const { uuid, type } = req.params
    debug(`request to /metrics/${uuid}/${type}`)
    let metrics = []
    try {
        metrics = await Metric.findByTypeAgentUuid(type, uuid)
    } catch (err) {
        return next(err)
    }

    if (!metrics || metrics.leng === 0) {
        return next(new Error(`Metrics (${type}) not found for agent with uuid ${uuid}`))
    }

    res.send(metrics)
})
```
## Pruebas de integración con Ava, Supertest y Sinon

> npm install --save-dev sinon proxyquire 

Nuevamente proxyquire es como para que cuando exista un require de alguna librería poder sobreescribirlo.

Vamos a hacer stubs de los módulos de base de datos, entonces en el archivo de pruebas

```js
const sinon = require("sinon")
const proxyquire = require("proxyquire")

let sandbox = null
let server = null
let dbStub = null
let AgentStub = {}
let MetricStub = {}

// Quito este del global const server = require("../server")
// Y lo coloco en el beforeEAch

test.beforeEach(async () => {
    sandbox = sinon.createSandbox()

    dbStub = sandbox.stub()
    dbStub.returns(Promise.resolve({
        Agent: AgentStub,
        Metric: MetricStub
    }))

    AgentStub.findConnected = sandbox.stub()
    AgentStub.findConnected.returns(Promis.resolve(agentFixtures.connected))

    const api = proxyquire("../api", {
        "platziverse-db": dbStub
    })

    server = proxyquire("../server", {
        "./api": api
    })
})

test.afterEach(() => {
    sandbox && sinon.restore()
})
```

Necesitaremos fixtures entonces creamos el directorio tests/fixtures y podemos copiar de platziverse-db/tests/fixtures/agent.js

Todo este código que se copia y pega de proyecto en proyecto se puede utilizar en un módulo. Y seguimos en los tests...

```js
// Requiero los fixtures
const agentFixtures = require("./fixtures/agent")

test.serial.cb("/api/agents", t => {
    request(server)
        .get("/api/agents")
        .expect(200)
        .expect('Contet-Type', /json/)
        .end((err, res) => {
            t.falsey(err, "Should not return an error")
            // Era así: 
            // let body = res.body
            // t.deepEqual(body, {}, "response body should be the expected")
            let body = JSON.stringify(res.body)
            let expected = JSON.stringify(agentFixtures.connected)
            t.deepEqual(body, expected, "response body should be the expected")
            t.end()
        })
})
```

El reto sería terminar las pruebas para la api

```js
test.serial.todo("/api/agents/:uuid")
test.serial.todo("/api/agents/:uuid - not found")
test.serial.todo("/api/metrics/:uuid")
test.serial.todo("/api/metrics/:uuid - not found")
test.serial.todo("/api/metrics/:uuid/:type")
test.serial.todo("/api/metrics/:uuid/:type/ - not found")
```

# Asegurando nuestra API REST con JWT

## Definición de JWT

El tema de seguridad se puede abordar utilizando el middleware PassportJS.

Los JWT son tokens encriptados que nos permiten realizar autenticación http entre dos partes y hacer un intercambio de información entre dos partes.

https://jwt.io

Cada JWT cuenta de tres partes, una cabecera, un payload y una firma de verificación.

Si copiamos el payload del JWT.

> node
>
> Buffer.from("el-payload-copiado', 'base64').toSTring('utf8')

Nos da un string utf8 si lo copiamos

> Buffer.from('string-que-copie', 'utf8').toString('base64')

La llave secreta es lo que hace seguro un JWT.

## Asegurando nuestra API con express-jwt

Creemos un pequeño módulo que nos permita crear JWT y verficar que los mismos estén correctos.

> npm install --save jsonwebtoken

Y creamos un archivo auth.js

```js
"use strict"

const jwt = require("jsonwebtoken")

function sign(payload, secret, callback) {
    jwt.sign(payload, secret, callback)
}

function verify(token, secret, callback) {
    jwt.verify(token, secret, callback)
}

module.exports = {
    sign,
    verify
}
```

Y se usaría algo así:

> node
>
> let auth = require("./auth")
>
> auth.sign({ username: "fcastellon" }, 'platzi', console.log)

Y nos imprime un json web token...

> auth.verify('el.jwt.token', 'platzi', console.log)

Nos da el payload y si le pasamos un secreto incorrecto nos dará un error.

Vamos a instalar un módulo que nos permite trabajar como un middleware para autenticar rutas

> npm install --save express-jwt

```js
const auth = require("express-jwt")

// Entonces todas las rutas tienen que ser así

api.get("/agents", auth(config.auth),  async (req, res, next) => {})
```

En el archivo de configuracion agregamos

config.js

```js
auth: {
    secret: process.env.SECRET || 'platzi'
}
```

> curl -v http://localhost:3000/api/agents

Da un error de que no encuentra authorization tokens. El jwt se pasa dentro del header de auth que utiliza http.

> curl -v -H 'Authorization: Bearer the.jwt.token' http://localhost:3000/api/agents

Entonces quedaría algo así:

```js
api.get("/agents", auth(config.auth), async (req, res, next) => {
    debug("A request has come to /agents")

    // Este middleware setea la propiedad user dentro del objeto request...
    const { user } = req
    if (!user || !user.username) {
        return next(new Error("Not authorized"))
    }

    let agents = []
    try {
        // Y podemos cambiar nuestro query
        if (user.admin) {
            agents = await Agent.findConnected()
        } else {
            agents = await Agent.findByUsername(user.username)
        }
    } catch (e) {
        return next(e)
    }
    res.send(agents)
})
```

Pero ahora fallaría el test de integración proque envia el error de que no encuentra el token de autorización. Entonces hay que modificar el test para crear un mock de jwt.

## Modificando las pruebas de integración

Tenemos que arreglar las pruebas de integración para que envíen el jwt.

En el api-test.js

```js
// Para hacer el promisify
const util = require("util")
// Contiene el sign y el verify
const auth = require("../auth")
// Con esto tenemos la función de sign como una función asíncrona
const sign = util.promisify(auth.sign)

let sandbox = null
let server = null
let dbStub = null
// Con esto podemos crear el un token de manera global
let token = null
let AgentStub = {}
let MetricStub = {}

// Entonces antes de cada test (dentro del beforeEach)
test.beforeEAch(async () => {
    // ...
    token = await sign({ admin: true, username: 'platzi'}, config.auth.secret)
})

test.serial.cb("/api/agents", t => {
    request(server)
        .get("/api/agents")
        // Set del token de authorización dentro de la prueba
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect('Contet-Type', /json/)
        .end((err, res) => {
            t.falsey(err, "Should not return an error")
            let body = JSON.stringify(res.body)
            let expected = JSON.stringify(agentFixtures.connected)
            t.deepEqual(body, expected, "response body should be the expected")
            t.end()
        })
})
```

## Implementando permisos con express-jwt-permissions

Ya vimos como asegurar las rutas de nuestra api usando el middleware de express-jwt. Ahora vamos a agregarle al payload un tema de permisos 

```json
{
    "permissions": [
        "metrics:read"
    ],
    "username": "platzi",
    "admin": true,
    "iat": 1502334997
}
```

Vamos a instalar el middleware express-jwt-permissions

> npm i --save express-jwt-permissions

Y este middlware se utiliza así:

```js
const guard = require("express-jwt-permissions")()

api.get("/metrics/:uuid", auth(config.auth), guard.check(["metrics:read"]), async (req, res, next) => {
    // Resto del código
})
```

