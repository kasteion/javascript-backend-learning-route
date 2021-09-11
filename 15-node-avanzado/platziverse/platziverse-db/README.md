# platziverse-db

## Usage

```javascript
const setupDatabase = require("platziverse-db");

setupDatabase(config)
  .then((db) => {
    const { Agent, Metric } = db;
  })
  .catch((err) => console.error(err));
```
## Estructura básica de un módulo de Node.js

Un módulo de nodejs tiene una archivo package.json que describe la información del módulo. Creamos platziverse-db y un archivo index.js... otra buena práctica es agregar el README.md.

Y este es el contenido del index.js

```javascript
"use strict";

module.exports = async function (config) {
  const Agent = {};
  const Metric = {};

  return {
    Agent,
    Metric,
  };
};
```

> npm install --save-dev standard

Script en el package.json

```json
"lint": "standard"
```

> npm run lint
>
> npm run lint -- --fix

Ahora puedo ejecutar node

> node
>
> const setupDatabase = require("./")
> 
> setupDatabase()

## Definición de entidades de base de datos

Agente
  - id, uuid, name, username, hostname, pid, connected, createdAt, updatedAt

Metric
  - id, agentid, type, value, createdAt, updatedAt

Un agente puede tener n metricas.

Nosotros tenemos dos alternativas para crear las entidades de base de datos, podemos utilizar sql plano en la base de datos (sql first) o utilizar herramientas para crear las entidades de base de datos basandonos en código javascript.

## Implementación de modelos con sequelize

Primero necesitamos instalar algunas dependencias: sequalize (orm), pg (El driver de postgresql) y pg-hstore (Otra dependencia que necesita sequelize)

> npm install --save sequelize pg pg-hstore

Creamos un nuevo directorio llamado lib tendrá la función de setup de base de datos (la de setup de sequelize) y más adelante la de setup de las entidades de base de datos.

Vamos a tener dos tipos de objetos, los modelos nativos de sequelize y los servicios. Nosotros no vamos a devolver todo el modelo de datos sino que vamos a definir servicios con datos custom y estos devolveran los datos de sequalize.

Dentro de lib creamos un archivo db.js

```javascript
"use strict"

// Requerimos sequelize
const Sequelize = require("sequelize")

// Aquí vamos a tener un tipo de singleton
let sequelize = null

module.exports = function setupDatabase (config) {
  if (!sequelize) {
    sequelize = new Seuqelize(config)
  }

  return sequelize
}
```

Creamos un directorio llamado modelos y dentro el archivo agent.js

```javascript
"use strict"

const Sequelize = require("sequelize")
const setupDatabase = require("../lib/db")

// Vamos a exportar una función llamada setupAgentModel que va a recibir el objeto de configuración para nosotros poder obtener una instancia de la base de datos utilizando la función que viene de db.js
module.exports = function setupAgentModel(config){
  const sequelize = setupDatabase(config)

  // Aquí podemos definir nuestro modelo
  // Creara la tabla agents
  return sequelize.define('agent', {
    uuid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hostname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pid: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    connected: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false      
    },
  })
}
```

Ahora creamos el modelo de metrica en models/metric.js

```javascript
"use strict"

const Sequelize = require("sequelize")
const setupDatabase = require("../lib/db")

// Vamos a exportar una función llamada setupAgentModel que va a recibir el objeto de configuración para nosotros poder obtener una instancia de la base de datos utilizando la función que viene de db.js
module.exports = function setupMetricModel(config){
  const sequelize = setupDatabase(config)

  // Aquí podemos definir nuestro modelo
  // Creara la tabla metrics
  return sequelize.define('metric', {
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}
```

## Implementación de un módulo básico de base de datos

Trabajando en el index.js

```javascript
'use strict'

// 1) Vamos a necesitar las funciones que acabamos de definir

const setupDatabase = require("./lib/db.js")
const setupAgentModel = require("./models/agent")
const setupMetricModel = require("./models/metric")

module.exports = async function (config) {

  // 2) Las entidades Agente y Metrica tienen una relación uno a muchos (un agente muchas métricas)

  // Llamando a sequelize creo el singleston
  const sequelize = setupDatabase(config)
  // Y cuando llamo a estas funciones utilizarán el singleton esto es útil para la parte de stubs y mocks
  const AgentModel = setupAgentMOdel(config)
  const MetricModel = setupMetriModel(config)

  // 3) Aquí creamos la relación, estas funciones crean automaticamente una llave relacionando ambas tablas.
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  // 4) Primero vamos a querer revisar que la base de datos está bien configurada, así que hacemos un authenticate ( esta función es una promesa )
  await sequelize.authenticate()

  // 5) Ahora hacemos un sync para que configure la base de datos
  // Lo dejamos por ahora porque si no existen las entidades la crea, etc, etc...
  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
```

## Implementación de script de inicialización de base de datos

Ahora vamos a crear un script de la base de datos para cuando vamos a hacer deploy o probar por primera vez lo ejecutamos, crea las entidades y relaciones y empezamos a correr

> psql postgres
>
> CREATE ROLE platzi WITH LOGIN PASSWORD 'Platzi';
>
> CREATE DATABASE platziverse;
>
> GRANT ALL PRIVILEGES ON DATABASE platziverse TO platzi;
>
> \quit

Creamos un nuevo archivo setup.js en la raiz del módulo de db

```javascript
"use strict"

const debug = require("debug")("platziverse:db:setup")
const db = require("./")


async function setup() {

  // La propiedad setup = true servirá en el script de index.js para que si esta en true, borra la base de datos y la crea de nuevo.
  // La propiedad logging le podemos pasar una función para esto podemos instalar el módulo de debug 
  // > npm install --save debug
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  // Si no dio error entonces log "Success" y sale con código 0
  console.log("Success")
  process.exit(0)
}

// Función de error
function handleFatalError (err) {
  // Imprimo el mensaje
  console.error(err.message)
  // Imprimo el stack
  console.error(err.stack)
  // Cierro el proceso con código 1 (código de error)
  process.exit(1)
}

setup()
```

```json
"script": {
  "setup": "DEBUG=platziverse:* node setup.js",
  "lint": "standard"
}
```

## Creando una advertencia sobre el borrado de base de datos

Vamos a preguntarle al usuario si esta seguro de borrar la base de datos y si no esta seguro entonces no continuar. Vamos autilizar dos módulos

> npm install --save inquirer chalk

Ahora siempre en el archivo de setup.js

```javascript
// 1) Requerimos inquirer y chalk
const inquirer = require("inquirer")
const chalk = require("chalk")

// 2) Antes de trabajar con inquirer necesitamos crear un prompt
const prompt = inquirer.createPromptModule()

async function setup() {
  const answer = await prompt([
    {
      type: "confirm",
      name: "setup",
      mensaje: "This will destroy your database, are you sure?"
    }
  ])

  if (!answer.setup) {
    return console.log("Nothing happended :)")
  }

  // Continuamos con la ejecución del script
}

function handleFatalError (err) {
  // En la función de manejo de errores utilizó chalk para que pinte en rojo [fatal error]
  console.error(`${chalk.red('[fatal error'])} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}
```

> DB_PASS='foo' npm run setup

Sucedió  que postgres estaba dejando hacer login desde localhost sin password

> cd /usr/local/var/postgres
>
> vim pg_hba.conf
>
> psql -U platzi platziverse

```bash
local   all   all                 password # Estaba en trust
host    all         127.0.0.1/32  password # Estaba en trust
host    all   all   ::1/128       password # Estaba en trust
```
## Introducción a pruebas unitarias con Ava.js

> npm install --save-dev ava

Y creamos el directorio tests en la raiz del proyecto. Y creamos el archivo agent-test.js

```javascript
"use strict"

const test = require("ava")

test("Make it pass", t => {
  t.pass()
})
```

Y definimos en el package.json el script para correr las pruebas

```json
"scripts": {
  "test": "DEBUG=platziverse:* ava tests/ --verbose"
}
```

O

```json
"scripts": {
  "test": "DEBUG=platziverse:* ava --verbose"
}
```

> npm test

```javascript
"use strict"

const test = require("ava")

let config = {
  logging: () => {}
}

let db = null

test.beforeEach(async () => {
  const setupDatabase = require("../")
  db = await setupDatabase(config)
})

test("Agent ", t => {
  t.truthy(db.Agent, "Agent service should exist")
})

```

Vamos a crear un config por defecto en caso de que no le pase parametros de configuración y eso será para las pruebas y que no se conecte a postgres sino que se conecte a

> npm install --save defaults

Esto sería en el index.js

```javascript
const defaults = require("defaults")

module.exports = async function (config) {
  config = defaults(config, {
    dialect: "sqlite",
    // Maximo de conexiones es 10, minimo es 0 y si la conexión está inactivo por 10 segundos la cierra
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    // Para que devuelva objetos json sencillos
    query: {
      raw: true
    }
  })
}
```

> npm install --save-dev sqlite3

## Introducción a code coverage con nyc

Para ver si los test que yo he creado están efectivamente cubriendo el código de mi aplicación.

> npm install --save-dev nyc 

Y luego modificamos el script de purebas para que ejecute ny antes de hacer las pruebas

```javascript
"scripts": {
  "test": "DEBUG=platziverse:* nyc ava test/ --verbose"
}
```

Y pues podemos generar un reporte en html

```javascript
"scripts": {
  "test": "DEBUG=platziverse:* nyc --reporter=lcov ava test/ --verbose"
}
```

> cd coverage
>
> lcov-report

Y allí hay un archivo index.html con el reporte de coverage. Tener un coverage del 100% no garantiza que las pruebas estén bien implementadas. Pero mientras más pruebe uno más caminos puede uno probar. Uno también debe probar posibles errores, otros paths, etc.

## Cómo hacer Mocks y Stubs con Sinon

Queremos probar los modelos que creamos anteriormente pero no queremos conectarnos directamente a la base de datos. Para esto vamos a crear unos servicios, estos servicios los van a utilizar los modelos para conetarse directamente a la base de datos. Vamos a hacer un stub que es: 

Un objeto muy similar al originar (En este caso al modelo), tiene los mismos métodos, pero la respuesta y argumentos de entrada están previamente especificados con alguna librería o alguna estrategia. 

Básicamente son objetos falsos. ¿Por qué no probamos directamente los modelos? Nosotros estamos probando nuestra implementación y por eso es que estamos probando los modelos utilizando stubs.

Para crear stubs podemos crearlos de forma manual ( Un objeto js simple) o podemos utilizar librerías como sinon:

> npm install --save-dev sinon

Nosotros necesitamos sobre escribir los modelos pero no tenemos acceso a ellos de ninguna forma. Los modelos los estamos requiriendo en el index original de la aplicación. Necesitamos sobre escribir los require de los modelos pero desde afuera. Hay otra librearía llamada proxyquire 

> npm install --save-dev proxyquire

Entonces siempre en el agent-tests.js

```javascript
"use strict"

const test = require("ava")}
// Requiero proxyquire
const proxyquire = require("proxyquire")

let config = {
  logging: () => {}
}

// Creo el Stub que va a representar al modelo
let MetricStub = {
  belongsTo: function() {}
}

// El stub de agente va a ser fresco en cada test
let AgentStub = null
let db = null

test.beforeEach(async () => {
  AgentStub = {
    hasMany: function() {}
  }


  const setupDatabase = proxyquire("../", { './models/agent': () => AgentStub, './models/metric': () => { MetricStub }})
  // const setupDatabase = require("../")
  db = await setupDatabase(config)
})

test("Agent ", t => {
  t.truthy(db.Agent, "Agent service should exist")
})
```

Esto correría y pasarían los tests... pero como asegurarnos que las funciones belongsTo y hasMany fueron llamadas? Podemos usar sinon y un spy que es una función a la cual le podemos consultar cuantas veces fue llamada y otras cosas...

```javascript
"use strict"

const test = require("ava")}
const proxyquire = require("proxyquire")
const sinon = require("sinon")

let config = {
  logging: () => {}
}

// Creo el Stub que va a representar al modelo
let MetricStub = {
  // En lugar de belongsTo: function() {}
  belongsTo: sinon.spy()
}

// El stub de agente va a ser fresco en cada test
let AgentStub = null
let db = null
// Crearemos un sandbox de sinon para que lo reinicie cada vez que se ejecuten los tests
let sandbox = null

// Antes de cada test creamos un sandbox y creamos un agente
test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    // En lugar de hasMany: function() {}
    hasMany: sinon.spy()
  }


  const setupDatabase = proxyquire("../", { './models/agent': () => AgentStub, './models/metric': () => { MetricStub }})
  // const setupDatabase = require("../")
  db = await setupDatabase(config)
})

// Despues de cada test debemos restablecer el sandbox


test.afterEach(t => {
  sandbox && sandbox.restore()
})

test("Agent ", t => {
  t.truthy(db.Agent, "Agent service should exist")
})

// Es recomendable que cuando trabajemos con stub los tests sean serial (en serie) para garantizar que no nos llenemos de stubs porque ava ejecuta los test de forma pararela
test.serial('Setup', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(ModelStub.belongsTo.called, 'ModelStub.hasMany was executed')

  // Hay propiedades como calledOnce si queremos garantizar que la función fue llamada solo una vez.
  // También está calledWith si queremos garantizar que la función fue llamada con algun argumento.
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')
  t.true(MetricStub.belogsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})
```
## Creación de fixtures y definición básica del servicio de Agent

Ya teniendo nuestros stubs de nuestro modelo de agente y metricas vamos a empezar a implementar las funciones del servicio de agentes. Queremos crear funciones para crear agentes en la base de datos, consultar agentes, obtener agentes.

Antes de pasar a la definición vamos a definir fixtures, fixtures son un set de datos de prueba con el que vamos a trabajar en este momento.

Creamos un directorio ./tests/fixtures y dentro un archivo llamado agent.js para definir los fixtures de los agentes.

```javascript
const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt : new Date(),
  updatedAt: new Date()
}

const agents = [
  agent, 
  extend(agents, { id: 2, uuid: 'yyy-yyy-yyw', connected: false, username: 'test'}),
  extend(agents, { id: 3, uuid: 'yyy-yyy-yyx'}),
 extend(agents, { id: 4, uuid: 'yyy-yyy-yyz', username: 'test'}),
   
]

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === "platzi"),
  findByUuid: id => agents.filter(a => a.uuid === id).shift()
  findById: id => agents.filter(a => a.id === id).shift()
}
```

Y regresamos a agent-tests.js

```javascript
const agentFixtures = require("./fixtures/agent")

let single = Objetc.assign({, agentFixtures.single})
let id = 1
let AgentStub = null

test.serial("Agent#findById", async t => {
  let agent = await db.Agent.findById(id)
  t.deepEqual(agent, agentFixtures.findById(id), 'Should be the same')
})
```

Al ejecutar la prueba nos dará un error

"db.Agent.findById is not a function"

Efectivamente escribimos la prueba antes de crear la función...

Para implementar la función vamos a empezar a crear la estructura de nuestros servicios

Creamos un nuevo archivo en la carpeta lib/agent.js

```javascript
"use strict"

module.exports = function setupAgent(AgentModel) {
  function findById(id) {}

  return {
    findById
  }
}
```

Y en el index.js

```javascript
// Requerimos setupAgent
const setupAgent = require('./lib/agent')

// y en donde teníamos const Agent = {}
const Agent = setupAgent(AgentModel)
```

## Implementación de findbyId y pruebas en el servicio Agent

Hemos implementado la prueba para findById del agent pero nos falta la implementación de la funcionalidad.

Nosotros vamos a utilizar el modelo, el modelo con sequelize ya tiene una función findById.
```javascript
"use strict"

module.exports = function setupAgent(AgentModel) {
  function findById(id) {
    // Implementación
    // Esto es como un wrapper de findById de sequelize para solo retornar las funciones que deseamos
    return AgentModel.findById(id)
  }

  return {
    findById
  }
}
```

La prueba dará error porque hay que agregarle la función findById al stub

```javascript
// En el agent test
AgentStub.findById = sandbox.stub()
```

Si ejecutamos la prueba tendremos error porque igual no devuelve nada. Para esto tenemos que utilizar sinon

```javascript
// Aqui le decimos que en findById cuando me mande el argumento id me resuelva la promesa con el fixture.findById
AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.findById(id)))

test.serial("Agent#findById", async t => {
  let agent = await db.Agent.findById(id)
  // La función debe ser llamada
  t.true(AgentStub.findById.called, 'findById should be called on model')
  // La función debe ser llamada solo una vez
  t.true(AgentStub.findById.calledOnce, 'findById should be calledl once')
  // La función debe ser llamada con los argumentos que les pasamos
  t.true(AgentStub.findById.calledWith(id), 'Should be called with specified id')
  // Lo que devuelve la función debe ser lo que tenemos en agent
  t.deepEqual(agent, agentFixtures.findById(id), 'Should be the same')
})
```
## Implementación de createOrUpdate

Primero la prueba le pasamos un agente si existe lo actualiza, si no existe lo crea

```javascript
test.serial('Agent#createOrUpdate', async t => {
  let agent = await db.Agent.createOrUpdate(single)
  t.deepEqual(agent, single, 'Agent should be the same')
})
```

Al ejecutar la prueba pues createOrUpdate is not a function

```javascript
async function createOrUpdate (agent) {
  // Primero creamos un objeto para seleccionar con sequelize
  const cond = { where: { uuid: agent.uuid }}

  const existingAgent = await AgentModel.findOne(cond)

  if (existingAgent) {
    const updated = await AgentModel.update(agent, cond)
    return updated ? AgentModel.findOne(cond) : existingAgent
  }

  // result sería un objeto de sequelize que debemos convertir a json normalito
  const result = await AgentModel.create(agent)
  return result.toJSON()
}

return {
  createOrUpdate,
  findById
}
```

Al ejecutar la prueba falla pues el stub no tiene las funciones findOne, update y create...

```javascript
let uuid = 'yyy-yyy-yyy'
let uuidArgs = { where: { uuid }}

AgentStub.findOne = sandbox.stub()
AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
```

Si corremos la prueba entonces falla porque al stub le falta el update

```javascript
AgentStub.update = sandbox.stub()
AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))
```

Ahora para garantizar que las funciones se llamen como yo considero que se deberían de llamar:

```javascript
test.serial('Agent#createOrUpdate', async t => {
  let agent = await db.Agent.createOrUpdate(single)
  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.update.calledOnce, 'update should be called once')
  t.deepEqual(agent, single, 'Agent should be the same')
})
```
## Revisión del servicio Agent

Las funciones implementadas en el servicio agent son

- createOrUpdate
- findById
- findByUuid: findOne({ where: { uuid }})
- findAll: findAll()
- findConnected: findAll({ where: { connected: true }})
- findByUsername: findAll( { where: { username, connected: true }})

## Implementación del servicio Metric

El servicio Agent reporta métricas cada cierto tiempo. Para implementar el servicio Metric vamos a necesitar tres funciones asíncronas:

- create
- findByAgentUuis
- findByTypeAgentUuid

En el index.js

```javascript
const setupMetric = require("./lib/metric")
// Donde era const Metric = {}
const Metric = setupMetric(MetricModel, AgentModel)
```

Y creamos el archivo en lib llamado metric.js

```javascript
"use strict"

module.exports = function setupMetric(MetricModel, AgentModel) {
  async function create (uuid, metric) {
    // Primero buscamos si el agente existe en la base de datos
    const agent = AgentMOdel.findONe({ where: { uuid }})
    if (agent){
      // Es lo mismo que metric.agentId = agent.id
      Object.assign(metric, { agentId: agent.id })
      // Almacenamos en la base de datos
      const result = await MetricModel.create(metric)
      return result.toJSON()
    } 
  }

  async function findByAgentUuid ( uuid ) {
    // Vamos a utilizar solo el modelo de metricas y vamos a hacer un join
    // attributes es para definir que quiero retornar no un select * sino un select type from metric
    // group es para select type from metric group by type
    // include sería el join con agent, no de vuelve los datos de agent y el join lo hace por uuid
    // Esta clase de consultas require el raw: true para que entregue json simple
    return MetricModel.findAll( { 
      attributes: ["type"],
      group: [ "type" ],
      include: [{
        attributes: [],
        model: AgentMOdel,
        where: {
          uuid
        }
      }],
      raw: true
     } )
  }

  async function findByTypeAgentUuid(type, uuid) {
    return MetricModel.findAll({
      attributes: ["id"; "type", "value", "createdAt"],
      where: { type },
      limit: 20,
      oreder: [[ "createdAt", "DESC" ]],
      include: [ { 
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
       } ],
       raw: true
    })
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}
```

Reto... crear las métricas.

## Realizando un ejemplo con el módulo de base de datos

Vamos a crear un script con el modelo para interactuar directamente con la base de datos.

Creamos un directorio llamado examples y dentro un archivo index.js

```javascript
"use strict"

const db = require("../")

async function run () {
  const config = {
    database: process.env.DB_NAME || "platziverse",
    username: process.env.DB_USER || "platzi",
    password: process.env.DB_PASS || "platzi",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres"
  }

  const { Agent, Metric } await db(config).catch(handleFatalError)

  const agent = Agent.createOrUpdate({
    uuid: "yyy",
    name: "test",
    username: "test",
    hostname: "test",
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  console.log("--agent--")
  console.log(agent)

  const agents = await Agent.findAll().catch(handleFatalError)
  console.log("--agents--")
  console.log(agents)

  const metric = await Metric.create(agent.uuid, {
    type: "memory",
    value: "300"
  }).catch(handleFatalError)
  console.log("--metric--")
  console.log(metric)

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)
  console.log("--metrics--")
  console.log(metrics)

  const metricsByType = await Metric.findByTypeAGentUuid("memory", agent.uuid).catc(handleFatalError)
  console.log("--metricsByType--")
  console.log(metricsByType)
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

run()
```

> node example/index.js

## Reto: Cómo modificar el script de inicialización de la base de datos

Nosotros creamos un script de la configuración de la base de datos. Este script lo vamos a querer ejecutar de forma automatizada. Más adelante cuando estemos haciendo deploy ese script no lo va a ejecutar un humano.

Reto # 2: Modificar el script de creación de base de datos para que evite el prompt de confirmación pasándole un flag --yes al script

> node setup.js --yes
>
> npm run setup -- --yes