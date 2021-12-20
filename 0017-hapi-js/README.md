# Introducción

## ¿Qué es Hapi?

Es un framework de Node.js para crear aplicaciones y servicios web. Esta diseñado y pensado para aplicativos modularizados. Su filosofía contempla la separación de la configuración y la lógica de negocio. Es más opinionado.

**Principales usos**

- Aplicaciones web
- APIs REST
- APIs GraphQL
- Proxies HTTP
- Integrador de múltiples backends

## Breve historia y estado actual

- El framework fue creado por Eran Hammer - Autor lídes y editor de la especificación OAuth
- Nombre derivado de HTTP API server
- Creado en Walmart labs por el equipo de mobile
- Solución a los picos de alto tráfico en el Black Friday

**Evolución**

- La primera versión de Hapi era un middleware de Express
- Lo fueron remplazando con un router
- Lo fueron remplaznado con Director
- Tiene un planteamiento filosófico de que es mejor tener configuración que código
- Recientemente rediseñado para usar los últimos avances del core de Node.js

**Versionamiento**

- Uso de Semantic versioning (Semver)
- Changelog automatizado y publicado en el sitio
- 17 versiones major hasta ahora

## Conceptos princiaples de hapi y creación de nuestro primer servidor

> mkdir overflow

> cd overflow

> npm init

> npm install --save-dev standard nodemon

> npm install @hapi/hapi

> touch index.js

```js
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
      return 'Hello World...'
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
```

# Creando un sitio básico con Hapi

## El objeto h, response y sus herramientas

**El objeto h**

Segundo argumento del handler, es una colección de utilidades y propiedades relativas a enviar información de respuesta.

**Métodos básicos**

- h.response - Crea un objeto de respuesta
- h.redirect - Redirecciona una petición

**El objeto h.response**

Generado por el método h.response, permite definir las propiedades de la respuesta al Browser o al cliente que realizó la petición.

- h.response.header: Configura un encabezado en la respuesta
- h.response.type: Permite definir el tipo mime de la respuesta
- h.response.code: permite definir el código de estado de la respuesta

```js
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
```

## Uso de plugins - Contenido estático

## Plantillas con Handlebars

## Rendelizado de vistas - Layout y template del home

## Recibiendo parámetros en una ruta POST - Creación del registro

## Definir una mejor estructura con buenas prácticas en Hapi

## Validando la información - Implementando Joi

## Introducción a Firebase

## Creando un modelo y guardando en firebase

## Implementando el login y validación del usuario

## Autenticación de usuarios - Cookies y estado

##
