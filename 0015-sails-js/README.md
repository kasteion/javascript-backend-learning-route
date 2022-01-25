# Setting up

## Tecnologías que vamos a usar

Hablemos un poco acerca de las tecnologías que vamos a usar en este curso y por qué vamos a usarlas. JavaScript es un lenguaje que vamos a usar por la capacidad que tiene de adaptarse a distintos proyectos.

En este curso vamos a usar:

ECMA Script
NodeJS
Stripe
VueJS
Mailgun
Heroku

## Dependencias

> npm install -g eslint

> npm install -g sail

> sails new ration

Seleccionar 1 para web app

> cd ration

> sails lift

# Los esenciales

## Arquitectura Backend

- api: Aquí está normalmente el backend
- assets: Aquí está normalmente el frontend
- config: Aquí hay principalmente configuración del backend y ambientes
- config/locales: Es configuración de internacionalización
- views: Es una mezcla de frontend y backend... es donde el backend renderiza vistas para el frontend

En config/routes.js hay configuraciones para redirects...

Digamos el GET / tiene una acción que se llama "view-homepage-or-redirect" y esta acción está en api/controllers/view-homepage-or-redirect.js

El view-homepage-or-redirect.js tiene esta instrucción: viewTemplatePath: 'pages/homepage' y eso significa que nos manda una vista que se encuentra en views/pages/homepage.ejs

## Arquitectura Frontend

El frontend está en assets

- dependencies: bootstrap 4, cloud, jquery, lodash, moment, parasails, vue..
- images: Las imagenes
- fonts: las fonts
- js: aquí está lo de Cloud que según entiendo es como una funcionalidad para interactuar con el backend, también están los components que son vue components.
- styles: Son todos los estilos de less, al final todo se importa a importer.less
- templates: Son templates pero aún no hay nada allí

## Parasails.js

Según entiendo paraSails se utiliza para registra páginas, por ejemplo el homepage se encuentra en:

assets/js/pages/homepage.page.js registrado con parasails pero ya que existe un homepage.page.js debe existir una view en views/pages/homepage.ejs y debe existir un estilo en assets/styles/pages/homepages.less y entiendo que el nombre es importante para que todo se aplique correctamente.

También parasails se puede utilizar para registrar utilities que serían funciones globales como la que existe en assets/js/utilies/open-stripe-checkout.js

Cada archivo de las paginas tiene mounted, beforeMount, tiene methods que pueden ser ejecutados por los elementos de nuestra páginas.

Tabíen se utiliza parasails para registrar componentes que son parecidas a las pages también y tienen sus eventos y metodos.

## Autenticación y login

Sails viene con la parte de inicio de sesión incluida y el usuario por defecto es

admin@example.com
abc123

En config/custom.js están las variables que indican cuanto duran las sesiones y esa clase de cosas.

Se puede ejecutar

> sails console

Para ejecutar el sitio pero también una consola interactiva. Y luego podemos correr en la consola de sails

> User.find().log()

Para que nos liste los usuarios.

El usuario por defecto lo crea el archivo config/bootstrap.js allí está la linea User.createEach

En config/policies.js están las politicas para decidir que partes son públicas y que partes son solo para usuarios autenticados.

La primera politica que encontramos es `'*': 'is-logged-in'`, y significa que todo está bloqueado el resto de politicas son para decir que cosas no están bloqueadas. Entonces

`'entrance/*': true`, significa que lo que está en api/controllers/entrance es accesible a todo el público.

Las policies son como middlewares con req, res y next pero en lugar de next le colocaron proceed.

## Inscripción de usuarios

Para inscripción de usuarios hay:

- signup.js => que contiene la lógica de signup, es una acción.
- signup.ejs => es la vista
- signup.less => son lo estilos
- signup.page.js =>
- view-signup.js => Es una acción de la vista, (Una acción que muestra la forma de signup)

## Sesiones y la base de datos

Sails viene con un orm llamado waterline.

Los modelos están en api/models

En config/models.js esta la configuración para las migraciones

Migrate está en alter, lo que significa que borra la data si hay un cambio en el modelo (Esto es malo para producción, tambien hay un modo safe)

```js
migrate: 'alter',
```

Si queremos correr el bootstrap otra vez hay que cambiar el HARD_CODED_DATA_VERSION

Hay custom hooks en api/hooks/custom y esos son para hacer cosas antes de que levante la aplicación o antes de ciertas peticiones.

En layout.ejs tenemos verificaciones como estas:

```
<% if(me) { %>
```

Para ver si el usuario esta logeado o no.

## Recuperación de passwords

## Verificación de emails

## Formato de contacto

## Manejando información de pagos

## Creando una nueva página

## Haciendo nuestra página interactiva

## Creando un nuevo modelo

## Testeo automático (Files)

## Creando una nueva acción Cloud

## Usando Cloud SDK

# Creando funcionalidades a medida

## Personalización

## Permisos

## Amigos con asociaciones

## Queries avanzadas y populate

## Modales

## Ajax forms

## Loading and error states

## Putting it all together

## Subiendo archivos backend

## Subiendo archivos frontend

## Descargando archivos

## Tu turno

# Growth and monetization

## Construyendo un paywall

## Suscripciones con pago recurrente

## Notificaciones

## Invitaciones (Usuarios existentes)

## Invitaciones (Nuevos usuarios)

## Uncalimed accounts (Cuentas sin contraseña)

# Going Live

## Variables de entorno y configuraciones de sailsjs y nodejs

## Asegurando nuestra aplicación

## Cloudflare y certificados SSL en SAILS

## Utilizando una Plataforma como Servicio

## Haciendo deploy a Heroku

## Configuración para enviar a producción

## Agregando variables de entorno del sistema en Heroku

## Configuración de la base de datos

## Temas a considerar nates de lanzar tu proyecto

# Contenido Extra

## JavaScript fullstack: diseñando el frontend de tu app con Bootstrap 4

## Server-side rendering con EJS

## Cómo funcionan los datastores
