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
