# platziverse-cli

## Implementación de un CLI Básico con Node

> chmod +x platziverse.js

En platziverse.js

```js
#!/usr/bin/env node

"use strict"

console.log("Hello World!")
// Estos son los argumentos el primero siempre es la versión de node y el segundo simpre es el comando que acabo de ejecutar y luego vienen los otros argumentos que le pasemos.
console.log(process.argv)
```

Minimist es un parser de argumentos

> npm install --save minimist

```js
#!/usr/bin/env node

"use strict"

console.log("Hello World!")
const args = minimis(process.argv)
console.log(args)
```

Hay un paquete que se llama args

> npm install --save args

```js
#!/usr/bin/env node

"use strict"

const args = require("args")

args
    .option("port", "The port on which the app will ber running", 3000)
    .option("reload", "Enable/disable livereloading")
    .command("serve", "Serve your static site", ["s"])

const flags = args.parse(process.argv)
```

> ./platziverse.js -h

## Introducción a Blessed/Blessed Contrib

Un par de modulos para generar applicaciones para la terminal más avanzadas. Utilizando una tecnología llamada curses.

chjj/blessed
yaronn/blessed-contrib

> npm install --save blessed blessed-contrib

```js
#!/usr/bin/env node

"use strict"

// Una regla de eslint
/* eslint new-cap: "off" */

// Base permite crear aplicaciones con interfaz rica en la terminal
const blessed = require("blessed")
// Contiene componentes y widgets
const contrib = require("blessed-contrib")

// 1. Necesitamos un ainstancia del screen de blessed
const screen = blessed.screen()
// 2. Crearemos un grid de una fila y 4 columnas. 
const grid = new contrib.grid({
    rows: 1,
    cols: 4,
    screen
})

// 3. En la primera columna (fila 0, columna 0, ocupa 1 fila, ocupa 1 columna) vamos a poner un árbol para listar agentes y sus métricas.
const tree = grid.set(0, 0, 1, 1, contrib.tree, {
    label: "Connected Agents"
} )

// 4. // Y el otro compente es un gráfico de linea
const line = grid.set(0, 1, 1, 3, contrib.line {
    label: "Metric",
    showLegend: true,
    minY: 0,
    xPadding: 5
})

// 6. En nuestra aplicación puedo captar teclas
screen.key(["escape", "q", "C-c"], (ch, key) => {
    process.exit(0)
})

screen.render()
```

## Integración con el agente de monitoreo 1

Al package.json en depndencies agregamos

```json
"dependencies": {
    "platziverse-agent": "file:../platziverse-agent"
}
```

> npm install

Y seguimos...

```js
#!/usr/bin/env node

"use strict"

/* eslint new-cap: "off" */

const blessed = require("blessed")
const contrib = require("blessed-contrib")
// 1. Requerimos el agente
const PlatziverseAgent = require("platziverse-agent")

// 2. creamos una nueva instancia del agente
const agent = new PlatziverseAgent()
const screen = blessed.screen()

// 5. Creamos un mapa de agentes y de métricas para tener un listado de agentes conectados y de métricas. Aquí almacenaremos la info.
const agents = new Map()
const agentMetrics = new Map()

const grid = new contrib.grid({
    rows: 1,
    cols: 4,
    screen
})

const tree = grid.set(0, 0, 1, 1, contrib.tree, {
    label: "Connected Agents"
} )

const line = grid.set(0, 1, 1, 3, contrib.line {
    label: "Metric",
    showLegend: true,
    minY: 0,
    xPadding: 5
})

// 4. Agregamos el listener de agent/connected
agent.on("agent/connected", payload => {
    const { uuid } = payload.agent
    
    // Si no existe el agente en mi mapa de agentes lo agrego 
    if (!agents.has(uuid)) {
        agents.set(uuid, payload.agent)
        agentMetrics.set(uuid, {})
    }

    renderData()
})

// 5. Implementamos la información renderData para pasarle al tree los agentes
function renderData() {
    const treeData = {}
    // Recorro todos los agentes
    for (let [uuid, val] of agents) {
        const title = `${val.name} - (${val.pid})`
        treeData[title] = {
            uuid,
            agent: true,
            children: {}
        }
    }

    tree.setData({
        extended: true,
        children: treeData
    })

    screen.render()
}

screen.key(["escape", "q", "C-c"], (ch, key) => {
    process.exit(0)
})

// 3. Antes de que haga el render nos conectamos con el agente
agent.connect()
screen.render()
```

> ./platziverse.js

Corremos un agente

> node ../platziverse-agent/examples/agent.js

## Integración con el agente de monitoreo 2

```js
const moment = require('moment')

agent.on("agent/disconnected", payload => {
    const { uuid } = payload.agent
    // Al desconectarse el agente se elimina del tree
    if (agents.has(uuid)) {
        agents.delete(uuid)
        agentMetrics.delete(uuid)
    }

    renderData()
})

agent.on("agent/message", payload => {
    const { uuid } = payload.agent
    const { timestamp } = payload

    if (!agents.has(uuid)){
        agents.set(uuid, payload.agent)
        agentMetrics.set(uuid, {})
    }

    const metrics = agentMetrics.get(uuid)

    payload.metrics.forEach(m => {
        const { type, value } = m
        if (!Array.isArray(metrics[type])) {
            metrics[type] = []
        }

        const length = metrics[type].length

        if (length >= 20) {
            metrics[type].shift()
        }

        metrics[type].push({value, typestamp: moment(timestamp).format("HH:mm:ss")})
    })

    renderData()
})

function renderData() {
    const treeData = {}
    for (let [uuid, val] of agents) {
        const title = `${val.name} - (${val.pid})`
        treeData[title] = {
            uuid,
            agent: true,
            children: {}
        }
        // Agrego esta parte en la función renderData()
        const metrics = agentMetrics.get(uuid)
        Object.keys(metrics).forEach(type => {
            const metric = {
                uuid,
                type,
                metric: true
            }

            const metricName = ` ${type}`

            treeData[title].children[metricName] = metric
        })

    }

    tree.setData({
        extended: true,
        children: treeData
    })

    screen.render()
}

agent.connect()
// focus del teclado en el arbol para poder interactuar con él
tree.focus()
screen.render()
```

## Integración con el agente de monitoreo 3

```js
// 1. Esto sería para mantener un listado de los nodos del arbol que tengo extendido
let extended = []
// 4. Este objeto sería para mantener una métrica que estoy seleccionando en ese momento.
const selected = {
    uuid: null,
    type: null
}

// 2. Utilizamos el evento select de tree
tree.on("select", (node) => {
    const { uuid, type } = node
    if (node.agent) {
        node.extended ? extended.push(uuid) : extended = extended.filter(e => e !== uuid)
        // 5. Cuando selecciono un agente ponco todo como null
        selected.uuid = null
        selected.type = null
        return
    }
    // 6. Si no es un agente entonces si asigno a selected
    selected.uuid = uuid
    selected.type = type

    // 7. Y aquí si llamo render Metric
    renderMetric()
})

function renderData() {
    const treeData = {}
    for (let [uuid, val] of agents) {
        const title = `${val.name} - (${val.pid})`
        treeData[title] = {
            uuid,
            agent: true,
            // 3. Aquí agregamos si el agente esta extendido
            extended: extended.includes(uuid),
            children: {}
        }
        const metrics = agentMetrics.get(uuid)
        Object.keys(metrics).forEach(type => {
            const metric = {
                uuid,
                type,
                metric: true
            }

            const metricName = ` ${uuid} ${type}`

            treeData[title].children[metricName] = metric
        })

    }

    tree.setData({
        extended: true,
        children: treeData
    })

    screen.render()
}




// 8. Definimos una función para renderizar las métricas
function renderMetric() {
    // Si selected.uuid y selected.type no tienen datos entonces pinto una linea sin datos
    if (!selected.uuid && !selected.type) {
        line.setData([ { x: [] y: [] titel: "" } ])
        screen.render()
        return
    }

    // obtengo los datos del agente
    const metrics = agentMetrics.get(selected.uuid)
    const values = metrics[selected.type]
    // Preparo lo que voy a mostar en la gráfica
    const series [{
        title: selected.type,
        x: values.map(v => v.timestamp).slice(-10),
        y: values.map(v => v.value).slice(-10) 
    }]
    line.setData(series)
    screen.render()
}
```