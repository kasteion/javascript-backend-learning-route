# Introducción a Node.js

## Conoce qué es Node.js

Node.js es una plataforma OpenSource para desarrollar aplicaciones, similar a .NET o la JVM, para construir aplicaciones de red y web concurrentes y altamente escalables.

Node.js utiliza JavaScript como lenguaje de programación y por lo tanto da la posiblidad a muchos ingenieros de desarrollar aplicaciones backend.

Node.js es una plataforma simple para desarrollar aplicaciones:

- Centradas en la red
- Modulares
- Aplicaciones JavaScript
- Utilizando programación asincrona y orientada a eventos.

¿Por qué decimos que Node.js es una plataforma simple?

1. Node.js consiste de los más escencial: small-core
2. Una lección de python: Una librería estándar muy grande es donde el código va a morir.
3. La modularidad de npm y Node permiten que exista un ecosistema vibrante.
4. La competencia que existe en open source promueve la calidad e inovación.

Node está construido en tres lenguajes: Javascript (Node.js Core API) y C/C++ (Node.js bindings, V8 Javascript engine, libuv, Openssl zlib, http_parser)

Networking e I/O

- Más de 1/4 del core de Node.js está dedicado a networking
- Está diseñado para manejar grandes cargas de entrada y salida
- Es muy utilizado para la web moderna

## Características de la plataforma Node.js

**Networking** y entrada y salida: Más de 1/4 del core de Node.js está dedicado a Networking. Node.js está especialmente diseñado para tipos de trabajo de entrada y salida (Con alta concurrencia o cargas de trabajo muy altas). La dependecia livuv es la encargada de todas las comunicaciones de red, el manejo de archivos y manejar el event loop. Tiene módulos como http, https, dns, net, dgram.

**Node.js** es modular. **npm** es el registro de paquetes OpenSource más grande del mundo. El sistema modular de Node.js resuelve problemas y el dependency hell. Promueve el dearrollo anti monolito. El santo grial del código desacoplado y reutilizable.

**JavaScript on the Server** Nos permite crear un puente efectivo entre el server y el browser. JavaScript por su facilidad de acercamiento, productividad y alegría del desarrollador y javascript no va a irse pronto.

La característica principal de **Node.js** es que podemos trabajar de manera asíncrona y orientada a eventos. El API se enfoca en la utilización de callbacks, eventos y streams. Perfecto para cargas de trabajo de entrada y salida y de high-throughput. Se ejecuta en un solo hilo, lo cual promueve patrones de diseño escalables.

**Node.js** es muy bueno para aplicaciones en tiempo real o para orquestación de recursos entre múltiples aplicaciones. Aplicaciones de red.

**Node.js** no es bueno para computaciones que requieren uso de la CPU, ni para desarrollar aplicaciones como Systems programming. Por ejemplo no sería muy bueno para big data. La idea es que no sería muy bueno para cualquier aplicaciones que pueda bloquear el hilo de ejecución.

## ¿Qué tipo de aplicaciones podemos desarrollar con Node.js?

Node.js es el proyecto open source con el crecimiento más rápido del mundo en este momento. Muchas empresas están empezando no solo a utilizarlo sino a contribuir y patrocinar y tienen empleados dedicados a que aporten al proyecto y esto es lo que permite que tenga un crecimiento más grande. 19 Millones 2016. 7 Millones nuevos al año. 100% de las Fortune 500 están utilizando Node.js

Con Node podemos desarrollar aplicaciones de escritorio, dispositivos embebidos, servidores web, aplicaciones móviles...

# Preparando el entorno de Desarrollo

## Cómo instalar Node.js

Primero hay que instalar NodeJS, aquí pues no voy a escribir nada más.

Instala nvm para instalar node version manager para gestionar varias versiones de node en unestro ambiente.

> nvm
>
> nvm install 6
>
> nvm use system

## Cómo instalar PostgreSQL y Redis

Esto lo voy a hacer con Docker.

> docker pull postgres
>
> docker run --d -name some-postgres -e POSTGRES_PASSWORD=Mysecretpasswrod -p 5432:5432 postgress
>
> docker pull redis
>
> docker run -d --name some-redis -p 6379:6379 redis

## Cómo instalar Visual Studio Code

Hay que instalar vs code, no voy a escribir mucho más al respecto.

- Pluggin VS Code for Node.js

## Cómo instalar Ansible y Vagrant?

Aquí si tengo duda de que va a hacer... vagrant no lo voy a instalar... Ansible para mí sería

> sudo apt install ansible

# Arquitectura del Proyecto

## Arquitectura y componentes del proyecto

Una plataforma de IoT trabajando con protocolos de tiempo real y compuesta de diferentes componentes que se comunican entre sí.

1. Un componente de base de datos, un modulo llamado platziverse-db que se va a utilizar para comunicarse con la base de datos.
2. Vamos a crear un módulo llamado platziverse-agent y en tiempo real utilizando mqtt vamos a entregar métricas.
3. Vamos a tener un mqtt server que también va a netregar info en tiempo real a una aplicación web.
4. Tendremos una aplicación web.
5. Tendremos un API Server. Que servira para obtener las 20 primeras métricas para poder pintar una gráfica y luego iremos obteniendo el resto de métricas en tiempo real.

# Introducción a protocolos y patrones de aplicaciones en tiempo real

## Cómo funciona el modelo Pub/Sub en MQTT y Web Sockets

Pub sub es un patrón de mensajería en el cual yo me suscribo a un canal donde se van a enviar mensajes (Por ejemplo un newsletter o un canal de chat). Un usuario que este suscrito puede recibir mensajes y enviar mensajes en el canal.

Hay protocolos que usan este patron como MQTT (Un protocolo pub/sub liviano que correo sobre tcp/ip, orientado a anchos de banda limitados lo que lo hace bueno para IoT), otro protocolo es el de Web Sockets (Un protocolo Full Duplex, el cliente y el servidor tienen comunicación bidireccional, la conexión se realiza sobre un único canal tcp, para establecerla debe haber un handshake a traves de http para hacer un upgrade de http a web sockets y la conexión se cierra cuando una de las partes decide cerrar el canal)

# Creando Módulo de Base de Datos

Las notas de la creación del módulo de base de datos está en platziverse-db

# Construyendo un servidor en tiempo real para internet de las cosas con Mosca/MQT

## Definición de un Broker de Mensajería

Esto será el módulo platziverse-mqtt que va a ser el servidor encargado de recibir los mensajes de los agentes de monitoreo y re-distribuirlos alos agentes que estarán "escuchando" o a la espera de esos mensajes.

Un message broker es un intermediario que se encargará de recibir un mensaje y redistribuirlo para esto nosotros vamos a implementar el protocolo MQTT para que realice esta función en nuestro servidor por las ventajas que este ofrece al estar optimizado para aplicaciones de IoT este protocolo "máquina a máquina" utiliza un ancho de banda muy bajo y puede funcionar con conexiones móviles y situaciones de ese estilo dónde el ancho de banda es limitado en muchas ocasiones y el consumo de datos debe ser lo más bajo posible.

La idea sería utilizar aedes como servidor mqtt y almacenar en redis los mensajes en lo que se entregan.

## Definición de los tipos de mensajes

Antes de empezar con la implementación de nuestro servidor de MQTT debemos definir el tipo de mensajes que vamos a utilizar. 

Crearemos un archivo readme en nuestra carpeta "platziverse-mqtt"

Vamos a utilizar un evento para cuando el usuario se conecte, para esto utilizamos "anget/connected" además utilizaremos "agent/disconnected" para cuando el agente se desconecte y por último un evento para cuando nos envíen un mensaje "agent/message".

Creamos el directorio platziverse-mqtt y dentro el archivo README.md

Las notas de la creación del servidor están en el readme de platziverse-mqtt

# Construyendo el agente de monitoreo

El agent va a ser el encargado de notificar al servidor cada una de las métricas que vamos a definir, y va a ser el módulo que vamos a utilizar para recibir la información, o para suscribirnos a los mensajes que están enviando todos los que están conectados a la aplicación.

Nosotros hemos visto EventEmitters como el servidor MQTT.
Este módulo lo vamos a desarrollar como un EventEmitter. Crearemos uno personalizado utilizando ES6.

El módulo de Node que nos permite crear EventEmitter está dentro del paquete events, que viene en el core de Node, así que no hay que instalar nada más. Para esto vamos a crear una clase que vamos a extender del EventEmitter, y luego la vasmoa exportar. Cuando vayamos a utilizar el módulo podremos exportar esta clase. El constructor de la clase va a recibir opciones, que inicialmente vamos a obviar. Lo último será llamar al constructor de la clase EventEmitter.

Creamos la carpeta platziverse-agent y dentro ejecutamos npm init.

Le agregamos "private": "true" para que no lo podamos publicar a npm.

El resto de las notas están en el readme de platziverse-agent.

# Construyendo una API REST con Express

Para crear la API vamos a definir un servidor con express. Así que creamos la carpeta platzivers-api y dentro ejecutamos

> npm init

Agregamos "private": true al package.json para que no lo exportemos.

> npm install --save-dev standard nodemon

Y creamos los script de en el package.json

```json
"scripts": {
    "lint": "standard",
    "lint-fix": "standard --fix",
    "start-dev": "DEBUG=platziverse:* nodemon server.js",
    "start": "NODE_ENV=production node server.js"
}
```

Y ahora instalamos 

> npm install --save express debug chalk

Y creamos el archivo server.js

Y segimos en el README.md de platziverse-api.

# Creando un Dashboard Web en tiempo real con WebSockets

Vamos a implementar el dashboard gráfico, vamos a crear un nuevo proyecto express que se va a encargar solo de la parte frontend. Utilizando el patrón backend for frontend que se utiliza mucho en nodejs (tengo un backend o un servidor web que se encarga solo de servir assets de frontend y este se comunica con un backend existente que tiene los datos)

> cd platziverse-web
>
> npm init
>
> npm install --save-dev standard nodemon
>
> npm install --save express debug chalk

El resto ya esta en README de platziverse-web

# Creando un Dashboard para la terminal en tiempo real con Blessed

Node no sirve solo para hacer aplicaciones web sino que puedo hacer aplicaciones de consola, aplicaciones para dispositivos embevidos, aplicaciones de escritorio, etc.

> mkdir platziverse-cli
> 
> cd platziverse-cli
>
> npm init

Cambiamos en el package.json (private = true y en vez de main seteamos bin)

```json
"private": true
"bin": "platziverse.js"
"scripts": {
    "lint": "standard"
}
```

> npm install --save-dev standard

Y creamos el archivo platziverse.js

# Depurando Aplicaciones Node.js

## Utilizando longjohn para mejores stacktraces

Debugear applicaciones asyncronas tiene un grado de dificultad un poco más alto que las aplicaciones tradicionales secuenciales pues la mayoría de las tareas asyncronas se están ejecutando en el evento loop y allí no tenemos acceso.

El módulo de longjohn es muy útil a la hora de desarrollar pues agrega al stack trace lo que sucede en el event loop.

Vamos a añadir longjohn a las dependencias de desarrollo

> npm install --save-dev longjohn

Esto es en platziverse-db/index.js

```js
"use strict"
// Agregamos esta línea al principio del index.js 
require("longjohn")
```

A modo de ejemplo

example.js

```js
setTimeout(() => {
    throw new Error("boom")
}, 2000)
```

> node example.js

```js
require("longjohn")
setTimeout(() => {
    throw new Error("boom")
}, 2000)
```

Solo debemos cargar longjohn si el entorno de ejecución es producción.

```js
if (process.env.NODE_ENV !== 'production') require('longjohn')
```
## Depurando en Desarrollo con node --inspect

Vamos a utilizar node con el flag inspect

> node --inspect server.js

Permite lanzar el Chrome Dev Tools desde el explorador

Abrimos Chrome y vamos a la dirección

chrome://inspect

En la pestaña de sources puedo ver el código, agregar breakpoints.

En la pestaña profiler podemos tomar cpu profiles (samples del procesador a medida que yo esté trabajando con mi aplicación, ver el stack trace, ver cuanto tiempo se tarda cada stack trace para ver posibles problemas de rendimiento de mi aplicación)

En la pestaña memory, se puede tomar un heap memory snapshot y allí podemos ver la mayoría de objetos que yo tengo creados y cuánto ocupa en memoria. Esto es bueno para encontrar memory leaks. Puedo compara dos snapshots y ver si la memoria está creciendo (tal vez tengo un leak)

## Depurando en Desarrollo con Visual Studio Code

Dentro VS Code --> Run & Debug allí podemos crear una configuración con el archivo launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug platziverse-web",
            "program": "${workspaceRoot}/platziverse-web/server.js"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Debug platziverse-api",
            "program": "${workspaceRoot}/platziverse-api/server.js"
        }
    ]
}
```

De esta forma puedo poner breakpoints desde el código en vs code, ver las propiedades, puedo ir avanzando paso a paso, puedo agregar variables al watch, puedo ver el call stack.

# Preparando nuestra aplicación para producción

## Preparando Proyecto para Producción 1

1. Verificar los package.json que el script start no este con nodemos y el NODE_ENV sea production esto habría que verificarlo en platziverse-db, platziverse-mqtt, platziverse-web

2. En platziverse-db en el script setup.js, el módulo de base de datos tiene un script que pide confirmación del usuario. Pero deberíamos pasarle un parametro para que lo configure sin esperar confirmación...

Minimist es para que nos ayude con los parametros.

> npm install --save minimist

setup.js

```js
const minimist = require("minimist")

const args = minimist(process.argv)

async function setup() {
    if (!args.yes) {
        const answer = await prompt([
            {
                type: "confirm",
                name: "setup",
                message: "This will destroy your database, are you sure?"
            }
        ])

        if (!answer.setup) {
            return console.log("Nothing happened :)")
        }
    }

    // Seguimos con nuestros setupo normal ... (el código que ya estaba) para que siga confirando la base de datos.
}

```

## Preparando Proyecto para Producción 2

3. En muchas partes estamos seteando variables de entorno para setear los hosts, bases de datos, etc, etc. Pero debemos definir variables de entorno en el lado del cliente, esto solo es posible en el paso de construcción en platziverse-web

En config.js

```js
"use strict"

module.exports = {
    endpoint: process.env.API_ENDPOINT || "http://localhost:3000",
    serverHost: process.env.SERVER_HOST || "http://localhost:8080",
    apiToken: process.env.API_TOKEN || "my-development-token"
}
```

En el app.js

```js
const { serverHost } = require("../config") 

// Y modificamos las peticiones http
const options = {
    method: "GET",
    URL: `${serverHost}/agents/${uuid}`,
    json: true
}
```

> npm install envify

```json
{
  "name": "multiverse-web",
  "version": "1.0.0",
  "description": "A Simple IoT Platform - Web Dashboard",
  "main": "server.js",
  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "prestart": "npm run build",
    "build": "NODE_ENV=production browserify -g envify -t babelify -t vueify -e client/app.js | terser -c -m -o public/bundle.js",
    "start-dev": "DEBUG=multiverse:* nodemon server.js",
    "prestart-dev": "npm run build-dev",
    "build-dev": "browserify -g envify -t babelify -t vueify -e client/app.js -o public/bundle.js",
    "lint": "standard"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.13.10",
    "@babel/preset-env": "^7.13.10",
    "babelify": "^10.0.0",
    "browserify": "^17.0.0",
    "envify": "^4.1.0",
    "nodemon": "^2.0.7",
    "standard": "^16.0.3",
    "terser": "^5.6.0",
    "uglify-js": "^3.13.1",
    "vueify": "^5.0.2"
  },
  "dependencies": {
    "chalk": "^4.1.0",
    "chart.js": "^2.9.4",
    "debug": "^3.2.7",
    "express": "^4.17.1",
    "express-asyncify": "^1.0.1",
    "moment": "^2.29.1",
    "multiverse-agent": "file:../multiverse-agent",
    "multiverse-utils": "file:../multiverse-utils",
    "random-material-color": "^1.0.5",
    "request": "^2.88.2",
    "request-promise-native": "^1.0.9",
    "socket.io": "^3.1.2",
    "socket.io-client": "^4.0.0",
    "vue": "^2.6.12",
    "vue-chartjs": "^3.5.1"
  }
}
```

Esto no sé si es necesario... porque babel daba problemas con el vbuild y las funciones async pero si se isntala el preset-env entonces creo que ya está...

Archivo .babelrc

```js
{
    "presets": ["es2015", "stage-3"],
    "plugins": ["transform-runtime"]
}
```

> npm install --save-dev babel-preset-stage-3

## Creación de scripts para despliegue con Ansible

Ansible --> Scripts de automatización usando yaml --> Utilizando yaml puedo crear playbooks que contienen la información de como voy a desplegar la aplicación, en los playbooks tengo las tareas que quiero que ejecute (copie esta carpeta, instale esto, corra este servicio)

https://galaxy.ansible.com

Aquí puedo buscar roles para instalar cosas, digamos para instalar postgress

https://galaxy.ansible.com/anxs/postgresql

> ansible-galaxy install anxs.postgresql
>
> ansible-galaxy install geerlingguy.redis
>
> ansible-galaxy install jdauphant.nginx

Necesitamos crear el directorio para nuestro proyecto de deploy

> mkdir platziverse-deploy

Antes de crear los playbooks (deploy-backend y deploy-frontend) debo crear los roles en un directorio llamado roles

> mkdir platziverse-deploy/roles

En este directorio de roles vamos a crear el rol de database que instalará postgresql y redis.

> mkdir platziverse-deploy/roles/database

Por lo general los roles pueden tener un direcotrio meta en que vamos a definir que dependencias tengo

> mkdir platziverse-deploy/roles/meta

Un directorio para sobreescribir las variables de configuración

> mkdir platziverse-deploy/roles/vars

Y un directorio de las tareas que voy a ejecutar despues de correr el rol (reiniciar el servicio, copiar información al servidor)

> mkdir platziverse-deploy/roles/tasks

Cada directorio debe tener un archivo main.yml entonces hay que crearlo para meta, para tasks y para vars

meta/main.yml

```yml
---
dependencies:
    - { role: ANXS.postgresql }
    - { role: geerlingguy.redis }
```

vars/main.yml

```yml
---
postgresql_databases: 
    - name: platziverse
      owner: platzi
      hstore: yes
postgresql_users:
    - name: platzi
      pass: platzi
      encrypted: no
postgresql_user_privileges:
    - name: platzi
      db: platziverse
      priv: "ALL"
```

tasks/main.yml

```yml
---
- name: Restarting PostgreSQL
  service: 
    name=postgresql
    state=reloaded
- name: Restarting Redis
  service:
    name=redis
    state=restarted
```
## Probando el database rol con Vagrant

> vagrant init

En el Vagrantfile

```ruby
Vagrant.configure(2) do |config|
config.vm.box = "ubuntu/xenial64"
```

> vagrant up

Necesitamos crear una llave ssh

> cd platziverse-deploy
>
> mkdir ssh
>
> ssh-keygen -t rsa -C "email@example.com - deploy"

Entramos a la máquina de vagrant

> vagrant ssh
>
> sudo su -
> 
> cd .ssh
>
> vim authorized_keys

En el archivo authorized_keys puedo pegar multiples llaves públicas y cualquier persona que tenga una llave privada que haga match con esa llave pública va a poder conectarse al servidor con esa llave.

> ssh root@127.0.0.1 2222 -i ssh/deploy

Esto es porque había un host con un fingerprint allí... en realidad habría que abrirlo y se puede borrar el host especifico.

> rm ~/.ssh/known_hosts 

Ahora vamos a realizar el playbook básico que ejecuta el rol de base de datos

Creamos el archivo backend.yml

./backend.yml

```yaml
---
- hosts: backend-*
  gather_facts: FAlse
  pre_tasks:
    - name: Install Python 2
      raw: test -e /usr/bin/python || (apt-y update && apt install -y python-minimal)
    - setup: 
  roles:
    - database
```

Creamos el archivo inventory.ini

./inventory.ini

```ini
backend-local ansible_ssh_user=root ansible_ssh_host=127.0.0.1 ansible_ssh_port=2222
```

Ejecutamos:

> ansible-playbook -i inventory.ini backend.yml --private-key ssh/deploy
>
> vagrant ssh
>
> psql -U platzi platziverse
>
> \quit
>
> redis-cli

## Creando scripts del rol de platziverse db y mqtt (script de automatización .yml)

**Node**

Nuestra aplicación depende de node.js entonces vamos a crear un rol para que instale node.js en el servidor

> mkdir platziverse-deploy/roles/node
>
> mkdir platziverse-deploy/roles/node/tasks
>
> touch platziverse-deploy/roles/node/tasks/main.yml

main.yml

```yml
---
- name: Downloading Setup Script
  get_url:
    url=https://deb.nodesource.com/setup_14.x
    dest=/tmp/install_node_14.sh
    mode=-u=rx,g=rx,o=rx
- name: Running Setup Script
  command: /tmp/install_node_14.sh
    creates=/etc/apt/sources.list.d/nodesource14.list
- name: Installing Node.js
  apt: 
    update_cache=yes
    state=latest
    name=nodejs
```

**Platziverse-DB**

Creamos el role llamado platziverse-db, este tendrá dos funciones: Copiar el código fuente de platziverse-db en una carpeta del servidor y ejecutar el script de setup.

> mkdir platziverse-deploy/roles/platziverse-db
>
> mkdir platziverse-deploy/roles/platziverse-db/tasks
>
> mkdir platziverse-deploy/roles/platziverse-db/meta

Una carpeta files en donde vamos a copiar todos los archivos que luego queremos que copie al servidor.

> mkdir platziverse-deploy/roles/platziverse-db/files

En meta/main.yml

```yml
---
dependencies:
  - { role: node }
```

Creamos un nuevo archivo tasks/deps.yml Es un archivo de dependencias del sistema operativo pues quiero que tenga git y build-essential instalado

```yml
- apt: name=git state=present
- apt: name=build-essential state=present
```

Creo tasks/main.yml

```yml
---
- include: deps.yml
- name: Copy platziverse-db
  copy: 
    src=platziverse-db
    dest=/usr/local/src
    mode=u=rwx,g=rwx,o=rx
- name: Run npm install
  command: npm install
    chdir=/usr/local/src/platziverse-db
    creates=/usr/local/src/platziverse-db/node_modules
- name: Setup DAtabase
  command: npm run setup -- --yes
    chdir=/usr/local/src/platziverse-db
```

> cp -rf ../../../platziverse-db files
>
> rm -rf node_modules

**Platziverse-Mqtt**

> mkdir platziverse-mqtt
>
> mkdir platziverse-mqtt/files
>
> mkdir platziverse-mqtt/meta
>
> mkdir platziverse-mqtt/tasks
>
> touch platziverse-mqtt/meta/main.yml
>
> touch platziverse-mqtt/tasks/main.yml
>
> touch platziverse-mqtt/tasks/deps.yml

tasks/deps.yml

```yml
---
- apt: name=git state=present
- apt: name=build-essential state=present
```

meta/main.yml

```yaml
---
dependencies:
  - { role: node }
  - { role: platziverse-db }
```

tasks/main.yml

```yaml
---
- include: deps.yml
- name: Copy platziverse-mqtt
  copy: 
    src=platziverse-mqtt
    dest=/usr/local/src
    mode=u=rwx,g=rwx,o=rx
- name: Running npm install
  command: npm install
    chdir=/usr/local/src/platziverse-mqtt
    create=/usr/local/src/platziverse-mqtt/node_modules
- name: Run npm start
  command: npm start
```

Y modificamos el playbook de backend

./backend.yml

```yaml
---
- hosts: backend-*
  gather_facts: FAlse
  pre_tasks:
    - name: Install Python 2
      raw: test -e /usr/bin/python || (apt-y update && apt install -y python-minimal)
    - setup: 
  roles:
    - database
    - platziverse-mqtt
```

Para no correr directamente el npm start podemos crear en files/platziverse-mqtt.service este será un servicio para systemd

```
[Unit]
Description=Platziverse MQTT
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=root
WorkingDiretory=/usr/local/src/platziverse-mqtt
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Entonces en el tasks/main.yml

```yaml
---
- include: deps.yml
- name: Copy platziverse-mqtt
  copy: 
    src=platziverse-mqtt
    dest=/usr/local/src
    mode=u=rwx,g=rwx,o=rx
- name: Running npm install
  command: npm install
    chdir=/usr/local/src/platziverse-mqtt
    create=/usr/local/src/platziverse-mqtt/node_modules
- name: Install systemd script
  copy: 
    src=platziverse-mqtt.service
    dest=/lib/systemd/system
- name: Start platziverse-mqtt
  service:
    name=platziverse-mqtt
    state=restarted
    enabled=yes
```

> ansible-playbook -i inventory.ini backend.yml --private-key ssh/deploy
>
> vagrant ssh
>
> sudo su - 
>
> systemctl status platziverse-mqtt

## Terminando los scripts faltantes

**Platziverse-API**

meta/main.yml

```yaml
---
dependencies:
  - { role: node }
  - { role: jdauphant.nginx }
  - { role: platziverse-db }
```

tasks/deps.yml

```yaml
---
- apt: name=git state=present
- apt: name=build-essential state=present
```

files/platziverse-api.service

```
[Unit]
Description=Platziverse API
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=root
WorkingDiretory=/usr/local/src/platziverse-api
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

files/platziverse-api.conf

```
server {
  listen                  80;
  server_name             api.platziverse.space;

  location / {
    proxy_set_header      Host $host;
    proxy_set_header      X-Real-IP $remote_addr;
    proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header      X-Forwarded-Proto $scheme;
    proxy_http_version    1.1;

    proxy_pass            http://127.0.0.1:3000;
  }
}
```

tasks/main.yml

```yml
---
- include: deps.yml
- name: Copying platziverse-api
  copy:
    src=platziverse-api
    dest=/usr/local/src
    mode=u=rwx,g=rwx,o=rx
- name: Running npm install
  command: npm install
    chdir=/usr/local/src/platziverse-api
    creates=/usr/local/src/platziverse-api/node_modules
- name: Install systemd script
  copy:
    src=platziverse-api.service
    dest=/lib/systemd/system
- name: Install nginx config
  copy:
    src=platziverse-api.conf
    dest=/etc/nginx/sites-enabled
- name: Start platziverse-api
  service:
    name=platziverse-api
    state=restarted
    enabled=yes
- name: Restart nginx
  service:
    name=nginx
    state=reloaded
```

**Platziverse Agent**

> cp -rf roles/platziverse-db roles/platziverse-agent
>
> cp -rf ../platziverse-agent roles/platziverse-agent/files
>
> rm -rf roles/platziverse-agent/files/platziverse-agent/node_modules

Y el tasks/main.yml

```yml
---
- include: deps.yml
- name: Copy platziverse-agent
  copy: 
    src=platziverse-agent
    dest=/usr/local/src
    mode=u=rwx,g=rwx,o=rx
- name: Run npm install
  command: npm install
    chdir=/usr/local/src/platziverse-agent
    creates=/usr/local/src/platziverse-agent/node_modules
```

**Platziverse Web**

meta/main.yml

```yml
---
dependencies:
  - { role: node }
  - { role: jdauphant.nginx }
  - { role: platziverse-agent }
```

files/platziverse-web.service

```
[Unit]
Description=Plativerse Web
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=root
WorkingDirectory=/usr/local/src/platziverse-web
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

files/platziverse-web.conf

```
server {
  listen                  80;
  server_name             platziverse.space;

  location / {
    proxy_set_header      Host $host;
    proxy_set_header      X-Real-IP $remote_addr;
    proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header      X-Forwarded-Proto $scheme;
    proxy_set_header      Upgrade $http_upgrade;
    proxy_set_header      Connection "upgrade";

    proxy_http_version    1.1;

    proxy_pass            http://127.0.0.1:8080;
  }
}
```

Este par de headers son para los web sockets

    proxy_set_header      Upgrade $http_upgrade;
    proxy_set_header      Connection "upgrade";


```yml
---
- include: deps.yml
- name: Copying platziverse-web
  copy:
    src=platziverse-web
    dest=/usr/local/src
    mode=u=rwx,g=rwx,o=rx
- name: Running npm install
  command: npm install
    chdir=/usr/local/src/platziverse-web
    creates=/usr/local/src/platziverse-web/node_modules
- name: Install systemd script
  copy:
    src=platziverse-web.service
    dest=/lib/systemd/system
- name: Install nginx config
  copy:
    src=platziverse-web.conf
    dest=/etc/nginx/sites-enabled
- name: Start platziverse-web
  service:
    name=platziverse-web
    state=restarted
    enabled=yes
- name: Restart nginx
  service:
    name=nginx
    state=reloaded
```

Y el playbook de backend quedaría así:

./backend.yml

```yaml
---
- hosts: backend-*
  gather_facts: False
  pre_tasks:
    - name: Install Python 2
      raw: test -e /usr/bin/python || (apt-y update && apt install -y python-minimal)
    - setup: 
  roles:
    - database
    - platziverse-mqtt
    - platziverse-api
```

Y crearíamos un nuevo playbook para frontend así:

./frontend.yml

```yaml
---
- hosts: frontend-*
  gather_facts: False
  pre_tasks:
    - name: Install Python 2
      raw: test -e /usr/bin/python || (apt-y update && apt install -y python-minimal)
    - setup: 
  roles:
    - platziverse-web
```

> ansible-playbook -i inventory.ini backend.yml --private-key ssh/deploy
>
> vagrant ssh
>
> sudo su -
>
> systemctl status platziverse-api
>
> curl -H 'Host: api.platizverse.space' https://localhost/api/agents

## Creación de servidores en DigitalOcean

Estamos listos para salir a producción. Utilizando DigitalOcean...

Dos servidores
    1. Backend: DB, MQTT, API
    2. Frontend: Web

En la parte de ssh le colocamos el mismo ssh/deploy que ya habíamos generado.

# Desplegando nuestra aplicación a producción

## Ejecutando los Scripts de Despliegue

El inventory.ini quedo así:

```ini
backend-production ansible_ssh_user=root ansible_ssh_host=165.227.65.215 ansible_ssh_port=22
frontend-production ansible_ssh_user=root ansible_ssh_host=45.55.128.174 ansible_ssh_port=22
```

1. Comprar dominio
2. Reconfigurar dns
3. En el dns crear un dominio type A para que resuelva a una IP.

(CloudDNS)

Modificamos nuestro proyecto platziverse-web agregando una nueva variable de entorno en config.js

```js
"use strict"

module.exports = {
    endpoint: process.env.API_ENDPOINT || "http://localhost:3000",
    serverHost: process.env.SERVER_HOST || "http://localhost:8080",
    mqttHost: process.env.MQTT_HOST || "mqtt://localhost",
    apiToken: process.env.API_TOKEN || "my-development-token"
}
```

Y en el server.js

```js
const { mqttHost } = require("./config")

const agent = new PlatziverseAgent({
    mqtt: {
        hosts: mqttHost
    }
})
```

Y es en platziverse-web.service en donde tenemos las variables de entorno de la aplicación:

files/platziverse-web.service

```
[Unit]
Description=Plativerse Web
After=network.target

[Service]
Environment=NODE_ENV=production
Environment=API_ENDPOINT=http://api.platziverse.space
Environment=SERVER_HOST=http://platziverse.space
Environment=MQTT_HOST=mqtt://api.platziverse.space
Type=simple
User=root
WorkingDirectory=/usr/local/src/platziverse-web
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Hacemos deploy primero del backend y luego del frontend

> ansible-playbook -i inventory.ini backend.yml --private-key ssh/deploy
>
> ansible-playbook -i inventory-ini frontend.yml --private-key ssh/deploy

## Utilizando Aplicación en Producción y cierre del curso

Ejecutamos el agente de ejemplo cambiandole unos parametros:

```js
const agent = new PlatziverseAgent({
    name: "Node.js Reloaded",
    username: "admin",
    interval: 1000,
    mqtt: {
        host: "mqtt://api.platziverse.space"
    }
})
```

> node example/agent.js

# Bonus: Utilizando platziverse-agent en BeagleBone Black y RaspberryPI

## Implementación de platziverse-agent con Johnny-Five

> vim index.js

:syntax on

```js
"use strict"

const five = require("johnny-five")
const BeagleBone = require("beaglebone-io")
const PlatziverseAgent = require("platziverse-agent")

const board = new five.Board({
    io: new BeagleBone()
})

const agent = new PlatziverseAgent({
    name: "beaglebone",
    usename: "kasteion",
    interval: 1000,
    mqtt: {
        host: "mqtt://api.platziverse.space"
    }
})

board.on("ready", function() {
    let temp = 0
    const sensor = new five.Thermometer({
        controller: "LM35",
        pin: 'A0'
    })

    agent.addMetric("temperature", function() {
        return temp
    })

    sensor.on("change", function() {
        temp = this.celsius
    })

    agent.connect()
})
```

> sudo node index.js