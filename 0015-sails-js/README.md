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

> sails lift

El codigo para la parte de recuperación de password se encuentra en api/controller/entrance/view-fogot-password.js

Si probamos con el usuario admin@example.com debería en la consola mostrarnos el contenido de lo que el email debería enviar.

El link es algo como http://localhost:3001/password/new?token=mi-token

El token es lo que trata de revisar para ver si se puede cambiar el password.

## Verificación de emails

Hasta ahora hemos estado utilizando el @example.com hack porque allí no se está haciendo verificaciones. Pero en algun momento debemos de verificar emails en verdad.

en config/custom.js se encuentra la linea verifyEmailAddresses: false.

Podemos cambiarla a verifyEmailAddresses: true para activar la verificación de emails

Debemos detener el servidor y levantarlo nuevamente con:

> sails lift

Podemos utlizar sendgrid para enviar correos y en custom.js hay una parte comentada para Automated email documentation. Me parece que la versión anterior de sails tenía mailgun.

Si se activa lo del email verification. Entonces debería mandar un correo para verificar la aplicación. Yyyyyy debería aparecer un banner de que la cuenta no está activada.

## Formato de contacto

Esta sería la forma de contacto...

En el archivo de config/routes.js, allí están todas las páginas y redirecciones. Así podemos agregar en los misc redirects uno que sea:

'/help': '/contact',

Este es un cambio en el backend que necesita reinicar el server, detenerlo y luego ejecutar

> sails lift

Se puede remplazar todo lo que diga NEW_APP_NAME por el nombre de nuestra aplicación.

En el config.js

Se puede cambiar esta variable:

internalEmailAddress: 'support+development@example.com',

Por la dirección real.

Los correos que le llegan a los clientes serán con esta dirección.

fromEmailAddress: 'noreply@example.com',

## Manejando información de pagos

La forma más rápida y facil sería utlizando stripe. En el custom.js está la parte de stripe para que tengamos las keys de stripe.

Sería de cambair estas credenciales:

```js
// stripePublishableKey: 'pk_test_Zzd814nldl91104qor5911gjald',
// stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
```

Podemos buscar en google stripe test cards. Para tener algunas tarjetas de prueba.

Stripe lo que hace es crear un token para nuestra tarjeta y nos lo da. Para hacer algo con esas tarjetas habría que tener el secret key de stripe y el token.

En update-profile.js tenemos la función que actualiza la información de stripe.

## Creando una nueva página

Para generar una página podemos correr

> sails generate page things/available-things

Esto genera 4 archivos

- la vista en views/pages/things/available-things.ejs
- la acción (view-action) en api/controller/things/view-available-things.js maneja las request para la vista y sirve la vista al frontend.
- una de estilos en assets/styles/pages/things/available-things.less
- y una de scripts assets/js/pages/things/available-things.page.js

Necesitamos agregar una ruta en el config/routes.js podemos agregar:

'GET /things/available-things': { action: 'things/view-available-things' },

Y hay que agregar en assets/styles/importer.less la linea

@import 'pages/things/available-things.less';

Esas son instrucciones que el comango sails generate nos indica.

> sails console --redis

Para cambiar el contenido de la página seria cambiando available-things.ejs

Para cambiar el estilo de la pagina seria cambiando available-things.less

Y para agregar código a esta página sería en available-things.page.js

Por ejemplo agregamos este método

```js
clickThing: (thingId) => {
  console.log('clicked thing #', thingId);
};
```

Y en nuestro available-things.ejs que sería con vue.js

@click="clickThing(1)"

## Haciendo nuestra página interactiva

En el método beforeMount de available-things.page.js

Podemos agregar

```js
this.things = [
  { id: 1, label: 'Sweet Red Drill' },
  { id: 2, label: 'Red Mountain Bike' }
];
```

Esto sería para simular que estamos haciendo una petición de data de algún lado.

y en available-things.ejs sería

```html
<ul>
  <li v-for="thing in things" @click="clickThing(thing.id)">{{thing.label}}</li>
</ul>
```

Ahora esta data iria mejor en el view-model que está en api

```js
fn: async function(inputs, exists) {
  var things = [
  { id: 1, label: 'Sweet Red Drill' },
  { id: 2, label: 'Red Mountain Bike' }
];

return exits.success({
  things: things
})
}
```

Lo que se retorna en esta función se inyecta en la vista a traves de la variable SAILS_LOCALS.

## Creando un nuevo modelo

El view-action ya está en el backend. Esto puede ser una llamada a la base de datos

> sail generate model Thing

Esto crea un nuevo modelo en api/models/Thing.js

Todos los modelos por default tienen createdAt, updatedAt y id. Y eso está definido en config/models.js

Entonces al modelo en attributes:

Colocamos

```js
label: {
  type: 'string',
  example: 'Mr. Waffle Maker',
  description: 'A label describing this thing'
},
```

Los tipos son de javascript y solo serían: string, boolean, number, json y ref. Casí nunca se usa json o ref.

example y description son opcionales... también se puede agregar si el atributo es required o no.

Luego, otra vez en view-available-things.js

```js
fn: async function(inputs, exists) {
//   var things = [
//   { id: 1, label: 'Sweet Red Drill' },
//   { id: 2, label: 'Red Mountain Bike' }
// ];

  // TODO: only fetch things that the user is allowed to see
  const things = await Thing.find();

  return exits.success({
    things: things
  })
}
```

En la consola habría que agregar algo a la base de datos.

sails> Things.create({}).log()
sails> Things.create({ label: 'Seet Red Drill' }).log()

## Testeo automático (Files)

Primero Thing.find() aparece marcado por e eslint ya que en la configuración del .eslintrc no está.

Hay dos .eslintrc en el proyecto. Uno para el proyecto general y otro para el frontend (dentro de assets). En el del backend va "Thing": true y en el del frontend "Thing": false. Porque hay cosas que queremos permitir en el backend y no el frontend.

Luego el package.json trae los scripts de test, lint y custom-tests.

Custom tests todavía no existen para tenerlos tenemos que instalar mocha

> npm install mocha --save-dev --save-exact

Y cambiamos el script de custom-test

"custom-tests": "node ./node_modules/mocha/bin/mocha ",

Hay unos tests en https://github.com/mikermcneil/ration

## Creando una nueva acción Cloud

Podemos hacer un select desde el REPL

> Thing.find().log()

Podemos borrar así:

> Thing.destroy({ id: 1 }).log()

O así:

> Thing.destroy({ label: '' }).log()

Y ahora si hacemos un find

> Thing.find().log()

Creemos un par de cosas más:

> Thing.create({ label: 'Lawn Mower that matches the grass' }).log()

> Thing.createEach([{ label: 'Rad mountain bike' }, { label: 'Thig Kenny G album' }]).log()

Ahora queremos una forma de mandar una acción desde el frontend para borrar o editar un elemento desde el frontend.

Para configurar el backeng debemos generar una acción... desde el cloud sdk.

> sails generate action things/destroy-one-thing

Esto crear un acción en api/controllers/thing/destroy-one-thing.js

```js
module.exports = {
  friendlyName: 'Destroy one thing',

  description: '',

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    // All done.
    return;
  }
};
```

Y lo cambiamos así:

```js
module.exports = {
  friendlyName: 'Destroy one thing',

  description: 'Delete the "thing" with the specified ID from the database.',

  // inputs son las variables que recibe
  // En este caso para borrar un elemento necesitamos un id
  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  // exits serían posibles respuestas, salidas, códigos de error, etc
  exits: {},

  fn: async function (inputs) {
    await Thing.destroy({ id: inputs.id });
    return exits.success();
  }
};
```

Tenemos que exponerle esto al frontend agregandolo en config/routes.js

'DELETE /api/v1/thing/destroy-one-thing': { action: 'thing/destroy-one-thing' },

## Usando Cloud SDK

Cloud SDK nos da un método que podemos llamar desde el frontend en lugar de hacer un request http.

> sails run rebuild-cloud-sdk

Podemos ir al archivo assets/js/cloud.setup.js allí es donde coloca el routing de la función.

> sails console --redis

Ahora deberíamos poder ejecutar

Cloud.destroyOneThing.with({ id: 4 }).log()

Entonces en la página (available-things.page.js):

```js
parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    clickThing: async function (thingId) {
      console.log('clicked thing #', thingId);
      // Ejecuta la función del backend
      await Cloud.destroyOneThing.with({ id: thingId });
      // Usa lodash para remover el objeto del state
      _.remove(this.things, { id: thingId });
      // Le indica a vue que refresque el componente
      this.$forceUpdate();
    }
  }
});
```

# Creando funcionalidades a medida

> docker run --name test-redis -d -p 6379:6379 redis

## Personalización

Podemos agregar una asociación al modelo:

```js
module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    label: {
      type: 'string',
      example: 'Mr. Waffle Maker',
      description: 'A label describing this thing'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    owner: {
      model: 'User',
      required: true
    }
  }
};
```

> sails console --redis --drop

> sails console --redis

Ahora para crear otra vez las cosas

> Thing.createEach([{ owner: 59, label: 'Rad mountain bike' }, { owner: 59, label: 'Thig Kenny G album' }]).log()

> Thing.create({ owner: 60, label: 'Lawn Mower that matches the grass' }).log()

Ahora si revisamos todavía vemos todas las cosas. Pero si queremos ver solo las cosas de las que somos dueños debemos modificar en view-available-things.js

```js
fn: async function(inputs, exists) {
//   var things = [
//   { id: 1, label: 'Sweet Red Drill' },
//   { id: 2, label: 'Red Mountain Bike' }
// ];

  // TODO: only fetch things that the user is allowed to see
  const things = await Thing.find({
    // this.req.me existe porque las politicas indican que el usuario esta logeado...
    owner: this.req.me.id
  });

  return exits.success({
    things: things
  })
}
```

## Permisos

Para esto cambiamos el destroy-one-thing.js

```js
module.exports = {
  friendlyName: 'Destroy one thing',

  description: 'Delete the "thing" with the specified ID from the database.',

  // inputs son las variables que recibe
  // En este caso para borrar un elemento necesitamos un id
  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  // exits serían posibles respuestas, salidas, códigos de error, etc
  exits: {
    forbidden: {
      description:
        "The user making this request dosn't have the permissions to delete this thing.",
      responseType: 'forbidden' // Equivalente a res.forbidden();
    }
  },

  fn: async function (inputs) {
    //Agregamos una verificación para ver si la cosa que quiero borrar me pertenece
    let thing = await Thing.findOne({
      id: inputs.id
    });

    if (thing.owner !== this.req.me.id) {
      // Esto lanzaría un error 500
      // throw new Error('Nope');

      // Lanzar un forbidden implica que tengo que definir un exit
      throw 'forbidden';
    }
    await Thing.destroy({ id: inputs.id });
    return exits.success();
  }
};
```

Ahora en bootstrap.js debemos meter datos para que los ingrese a la base de datos

let user = await User.createEach(...).fetch()

## Amigos con asociaciones

Para agregar asociaciones modificamos el modelo para User.js

```js
//  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
//  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
//  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

//
friends: {
  collection: 'User',
}
```

En el bootstrap.js podemos agregar un usuario como amigo del otro

```js
// En el usuario mikeMcNeal, en su colección friends, agrego a ryanDahl
await User.addToCollection(mikeMcNeal.id, 'friends', ryanDahl.id);
```

addToCollection tiene tres argumentos, el padre de la asociación, el nombre de la asociación y el miembro de la asociación. El tercer parametro podría ser un array... para agregar varios usuarios a la colleción al mismo tiempo.

## Queries avanzadas y populate

Ahora no solo vamos a ver las cosas de la que somos dueños sino las de nuestros amigos. Para eso debemos modificar en view-available-things.js

```js
fn: async function(inputs, exists) {
//   var things = [
//   { id: 1, label: 'Sweet Red Drill' },
//   { id: 2, label: 'Red Mountain Bike' }
// ];

  // Necesitamos hacer un populate para que exista la collection friends
  let me = await User.findOne({ id: this.req.me.id }).populate('friends');

  // var friendIds = _.pluck(me.friends, 'id');
  var friendIds = _.map(me.friends, 'id');

  const things = await Thing.find({
    or: [
      { owner: this.req.me.id },
      { owner: { in: friendIds }}
    ]
  });

  return exits.success({
    things: things
  })
}
```

```
<small class="owner text-primary" v-else>{{
            me.friends.find((friend)=>friend.id===thing.owner).fullName
          }}</small>
```

## Modales

En available-things.page.js

```js
parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    things: [],
    confirmDeleteThingModalOpen: false,
    //…
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    //…
  },
  mounted: async function () {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    clickThing: async function (thingId) {
      console.log('clicked thing #', thingId);
      // Ejecuta la función del backend
      await Cloud.destroyOneThing.with({ id: thingId });
      // Usa lodash para remover el objeto del state
      _.remove(this.things, { id: thingId });
      // Le indica a vue que refresque el componente
      this.$forceUpdate();
    }

    // Esto es nuevo
    clickDeleteThing: function() {
      console.log('Clicked the "delete" button!');
      this.confirmDeleteThingModalOpen = true;
    }
  }
});
```

En assets/js/components esta el modal component llamado modal.component.js

Y en available-things.ejs

```html
<div id="available-things" v-cloak>
  <h1>Things</h1>
  <p>View available items to borrow, or upload your own things.</p>
  <button>TODO</button>

  <ul>
    <li @click="clickThing(1)">Sweet Red Drill</li>
    <li @click="clickThing(2)">Rad Mountain Bike</li>
  </ul>
  <!-- <h1>TODO: Implement this page.</h1>
  <p>(See also <em>assets/styles/pages/thigs/available-things.less</em>, <em>assets/js/pages/thigs/available-things.page.js</em>, and <em>api/controllers/thigs/view-available-things.js</em>.)</p> -->

  <% /* Agregamos el modal "Confirm Delete Thing" Modal */ %>
  <modal v-if="confirmDeleteThingModalOpen">
    <h1>Hello!</h1>
  </modal>
</div>
<%- /* Expose server-rendered data as window.SAILS_LOCALS :: */
exposeLocalsToBrowser() %>
```

## Ajax forms

Ajax Form está en assets/js/components y es llamado ajax-form.component.js

Y en available-things.ejs

```html
<modal
  v-if="confirmDeleteThingModalOpen && selectedThing"
  v-cloak
  key="delete"
  @close="closeDeleteThingMOdal()"
>
  <ajax-form
    action="destroyOneThing"
    :syncing.sync="syncing"
    :cloud-error.sync="cloudError"
  >
    <div class="modal-header">
      <h5 class="modal-title">Remove this item?</h5>
      <button
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span>&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>
        Are you sure you want to remove this {{ selectedThing.label || 'item'
        }}?
      </p>
      <p>This item will no longer be available to share with friends.</p>
    </div>
    <div class="modal-footer">
      <button data-dismiss="modal" class="btn btn-outline-secondary mr-1">
        Nevermind
      </button>
      <button type="submit" class="btn btn-danger ml-1">Remove</button>
    </div>
  </ajax-form>
</modal>
```

Y en available-things.page.js

```js
data: {
    things: [],
    confirmDeleteThingModalOpen: false,
    selectedThing: undefined,
    // Syncing / loading state
    syncing: false,
    // Server error state
    cloudError: ''
  },
```

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
