# Conocer y comprender cómo se realizan las conexiones hacia los servidores a través de internet y sus implicaciones en el desarrollo de servidores

## Presentación

Como crear todo el backend y api de un servidor en Node. Desde servir estáticos hasta crear la api. Sistema de módulos, trabajar con buena arquitectura, que pueda escalar.

API y Backend de un Chat

## Qué es Node y cómo instalarlo

Node.js es un entorno en tiempo de ejecución multiplataforma de código abierto para la capa del servidor basado en el lenguaje de programación ECMAScript, asíncrono y basado en el motor V8 de Google.

Node.js es ejecutar JavaScript en un entorno completamente diferente al navegador, ej.: terminal, servidor. Funciona con el motor V8 de Chrome. Se puede utilizar para crear herramientas como Webpack, Babel, PM2, Electron.

## ¿Qué son y cómo se usan las peticiones HTTP?

HTTP es el protocolo de comunicación que permite las transferencias de información sobre la Web. (Entre cualquier elemento que está en la Web: Servidores, Cliente, IoT)

**¿Por qué es importante?**

Porque es un lenguaje común para todas las comunicaciones. Es un idioma común.

**¿Cómo es una petición?**

El cliente envía una petición a través de Internet al servidor.

Cliente --> Internet --> Servidor

Ejemplo:

```
GET /index.html HTTP/1.1
Host: www.example.com
Referer: www.google.com
User-Agent: Mozilla/5.0
Connection: keep-alive
```

**¿Cómo es una respuesta?**

```
HTTP/1.1 200 OK
Date: Fri, 31 Jun 2019 23:59:59 GMT
Content-Type: text/html
Content-Length: 1221

<html>...</html>
```

**Puntos Clave**

- Métodos: Qué quieres hacer. (GET, POST, PUT, DELETE)
- Estado: Cómo ha ido la operación: (Errores ? 200, 403, 500)
- Cuerpo: Lo que el servidor devuelve. (Archivo html, javascript, json)

## Métodos, cabeceras y estados

**Métodos**

Son los verbos que le dicen al servidor "lo que queremos hacer". Los verbos principales son:

- **GET**: Lo utilizamos siempre que queremos recoger información del servidor. Ej.: Información de un producto, Listado de elementos, Ver una página HTML o un archivo CSS.

- **POST**: Lo utilizamos siempre que queremos añadir información al servidor. Ej.: Añadir un producto nuevo, enviar un formulario, un nuevo comentario.

- **PUT**: Lo usamos cuando queremos reemplazar información en el servidor. Ej.: Cambiar el contenido de una página, Reemplazar un producto por otro, Editar un mensaje.

- **PATCH**: Lo usamos cuando no queremos editar completamente una parte de la información sino una parte pequeñita. Ej.: Cambiar la foto de un usuario, Modificar el precio de un producto.

- **DELETE**: Lo usamos para cuando queremos eliminar información del servidor. Ej.: Eliminar un mensaje, Quitar un producto del carrito.

- **OPTIONS**: Lo usamos para pedir información sobre los métodos. Ej.: Saber si puede ejecutar POST, PUT, PATCH o DELETE.

**Cabeceras**

Las cabeceras van a darnos información contextual de la petición. No es lo que quiero hacer, sino como quiero hacerlo.

- **En la Request**: (POST, PUT, PATCH) Podemos tener cabeceras de:

  - Autenticación: Para autenticación y para asegurar que podemos pedir cosas al servidor. (`Authorization`)

  - Cache: Es para almacenamiento temporal. Le indica al cliente durante cuánto tiempo la respuesta va a ser la misma. (`Cache-Control`, `Expires`)

  - Cors: Cross Origin Resource Sharing. Son para manera información desde fuera de nuestro servicio. Para definir desde donde se puede consumir. Si desde todo Internet o solo desde esta url.

  - Cookies: Son super utilizadas para compartir información entre peticiones. Es una cabecera que se encarga el navegador y el servidor de mantener siempre esa cabecera en las peticiones y automáticamente podemos compartir información como que usuario soy. (`Access-Control-Allow-Origin`)

  - Accept: La cabecera accept define el contenido que acepta. Si solo quiero acepta json, html, con utf-8. (`Accept`, `Accept-Charset`, `Accept-Encoding`)

  - Indicaciones

  - Condiciones

  **Estados**

  Los estados son un número que nos va a indicar que es lo que ha pasado con la petición. Le fue bien, mal, se ha redirigido.

- **2XX**: Todo ha ido bien.

  - 200: Todo Ok
  - 201: Creado

- **3XX**: La petición se ha redirigido a otro sitio.

  - 301: Moved permanently
  - 304: Not Modified

- **4XX**: Errores del cliente.

  - 400: Bad request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not found

- **5XX**: Ha habido un error al procesar la petición.

  - 500: Internal server error.

## Cuerpo y query de la petición.

Como enviar verdaderamente información del cliente al servidor y del servidor al cliente.

**Cuerpo (Body)**

El cuerpo es la información de la petición. La información en sí que queremos añadir, enviar o que el servidor nos dá. Ej.: Los datos del usuario que quieres añadir.

**Qué tiene y cómo viene?**

Todo esto depende de las cabeceras. La cabecera `Content-Type` me dice que tipo de contenido viene, y la cabecera `Content-Length` me dice que tan largo es este contenido.

**Posibles Content-Type**

- text/html
- text/css
- application/javascript
- image/jpeg
- application/json
- application/xml

Por ejemplo, en una request

```
[POST]
http://api.com/user
content-type: application/json
{
    "name": "Carlos",
    "username": "CodingCarlos"
}
```

En la response:

- En cualquier método
- Un archivo html, css, js...
- Los datos de un producto

```
[POST]
content-type: application/json

{
    "id": "4u597xsa00xr1",
    "name": "Carlos",
    "username": "CodingCarlos"
}
```

o

```
[GET]
http://example.com
content-type: text/html

<html>
    <head>...</head>
    <body>...</body>
</html>
```

**Query**

Las queries permiten añadir información extra a lo que queremos enviarle al servidor. Ej.: El orden en que queremos los datos, parámetros que quieres medir. Quiero pedir algún dato específico. Ej.: youtube.com/watch?v=ZKFwQFBwQFU, api.com/person?orderby=name&age=25

Pueden ser una forma de compartir datos con el frontend, pero el usuario puede ver los datos que se comparten y nunca debemos mandar información sensible así. Ej.: miweb.com?utm_source=medium, miweb.com?color=red

La estructura del query consiste en:

- Añadir ? al final de la URL
- nombre=valor
- Separados con &

# Crear un servidor HTTP en JavaScript, y comenzar a escuchar y responder peticiones desde un cliente

## Crear un servidor http desde NodeJS

> node --version
>
> npm --version
>
> npm init
>
> npm install express

Creamos el server.js

```javascript
const express = require("express");

var app = express();

app.use("/", function (req, res) {
  res.send("Hola");
});

app.listen(3000);
console.log("La aplicación esta escuchando en http://localhost:3000");
```

> node server.js

## Cómo pueden venir las peticiones

Debemos crear un router de express.

```javascript
const router = express.Router();
```

El router de express es una de las piezas más importantes de express pues nos permiten separar nuestras peticiones por cabeceras, por metodos, por url. Para trabajar y separar nuestras peticiones al máximo.

```javascript
...
app.use(router);

router.get('/', function(req, res){
  res.send('Lista de mensajes');
})

router.post('/', function(req, res){
  res.send('Mensaje añadido');
})

router.delete('/', function(req, res){
  res.send('Mensaje borrado');
})
```

## Recibir información desde el cliente: Body y Query

> nodemon server.js

Vamos a instalar el body parser. Es un módulo de express para trabajar con el body de forma muy sencilla.

Ok, esto ya no se hace así...

> npm install body-parser

```javascript

...

//const bodyParser = require('body-parser');

...

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

...

router.post('/', function(req, res){
  console.log(req.body);
  console.log(req.query);
})
```

## Información contextual: Leer las cabeceras

Ya tenemos la opción de poder trabajar con toda la información de nuestros parametros http pero todavía nos faltan las cabeceras.

Las cabeceras vienen en la request...

```javascript
router.post("/", function (req, res) {
  console.log(req.heders);
  console.log(req.body);
  console.log(req.query);
});
```

Entonces el header vendría algo así:

```javascript
{
  host: 'localhost:3000',
  connection: 'keep-alive',
  'cache-control': 'max-age=0',
  'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'sec-fetch-site': 'none',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-user': '?1',
  'sec-fetch-dest': 'document',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'es-419,es;q=0.9,en;q=0.8'
}
```

De los headers los más interesantes de trabajar son:

- cache-control: para indicar cuando vence el cache.
- user-agent: Es bueno para saber si viene desde movil, linux, chrome, mozilla.
- accept y accept-econding: para indicar lo que aceptamos

Pero podemos setear los headers del response

```javascript
router.post("/", function (req, res) {
  console.log(req.heders);
  console.log(req.body);
  console.log(req.query);
  res.header({
    "custom-header": "Nuestro valor personalizado",
  });
});
```

De esta forma, en el response pueden ir headers que el cliente puede utilizar de diferentes formas. Por ejemplo, si configuramos el cliente para que solo responda si viene ciertas cabeceras específicas (Para determinar si es el mi servidor o no es mi servidor).

## Tipos de respuesta: Vacía, plana, con datos y estructurada

Ya conocemos lo que podemos hacer con http y nodejs. Ahora como podemos hacer las respuestas, porque estamos devolviendo cualquier cosa...

Podemos devolver respuestas vacías...

```javascript
res.send();
```

Podemos devolver un status

```javascript
res.status(201).send();
```

Podemos devolver Status y mensaje:

```javascript
res.status(201)send({ error: '', body: 'Creado correctamente'});

res.status(201)send({ error: '', message: 'Creado correctamente'});

res.status(201)send([{ error: '', message: 'Creado correctamente'}]);
```

## Respuestas coherentes

Ahora ya sabemos como responder a las peticiones http de todas las formas posibles, pero tenemos que responder de forma coherente. Una forma de hacerlo es responder a todas las peticiones desde el mismo sitio, creando un módulo que responda las peticiones.

Creamos un archivo nuevo network/response.js

```javascript
exports.success = function (req, res, msg, status) {
  //res.send("Primera respuesta");
  //res.send(msg);
  //res.send({ error: "", body: msg });
  res.status(status || 200).send({ error: "", body: msg });
};

exports.error = function (req, res, msg, status) {
  res.status(status || 500).send({ error: msg, body: "" });
};
```

Y en el server.js

```javascript
const response = require("./network/response");

router.get("/", (req, res) => {
  response.success(req, res, "Lista de mensajes");
});
```

## Servir archivos estáticos

Para esto en server.js tenemos que hacer

```javascript

...

app.use('/app', express.static('public'));
```

Y creamos un archivo index.html dentro de una carpeta public.

```html
<html>
  <body>
    Hola, soy un estático
  </body>
</html>
```

## Errores: Cómo presentarlos e implicaciones en la seguridad

Tenemos que ser muy cuidadosos con la información que le entregamos al cliente. Si enviamos información en un login diciendo "El usuario es correcto, la contraseña es incorrecta" entonces ya estamos dando información de que cierto usuario si existe. Y me pueden hacer un ataque de fuerza bruta con el usuario que ya se sabe qeu si existe.

Al usuario no le queremos dar los errores específicos, pero a nosotros si nos interesa tener los errores específicos. Para el usuario son los mensajes de error no tan específicos, pero para nosotros son los logs.

Entonces, a lo mejor en er archivo de response.js podemos:

```javascript
exports.error = (req, res, message, status, detail) => {
  console.error(details);
  res.status(status || 500).send({
    error: message,
    body: "",
  });
};
```

Si tenemos, digamos un error de conexión con la base de datos. No le digamos al cliente que hay un error con la base de datos. Mejor enviemos el mensaje "Error interno". Y en el log si ponemos `[ERROR]: Error de conexión con la base de datos. - Usuario y contraseña inválidos.`

# Comprender y desarrollar la arquitectura básica de un backend en NodeJS, y comunicarse entre módulo

## Conceptualmente: Rutas, controladores y bases de datos

1. Cualquier petción que nos llegue viene siempre desde Internet.

**Internet -> Server.js**

2. El primero que recibe nuestra petición es el server.js Este se va a encarga de verificar que las peticiones son correctas para transferirlas o directamente rechazarlas si hay algún problema. También es el que configura toda la información importante de nuestro servidor (db, cabeceras, etc.)

**Server.js -> routes.js**

3. Server transfiere las peticiones a un archivo de rutas, se va a encargar de ver a donde va a ir la petición y enviarla al componente adecuado.

**routes.js -> componente**

4. Hay una carpeta de componentes y cada componente está en su propia carpeta. Dentro de la carpeta del componente. Hay tres archivos:

- Un archivo de rutas (network.js) donde vamos a gestionar todas las rutas, endpoints e información que tenga que ver con el protocolo http.
- Un controlador (controller.js), el controlador tiene la lógica del componente. Todo lo que es verificar la información, agregar información, extraer información, etc. Esto es la lógica de negocio.
- Un archivo encargado de gestionar la base de datos (store.js) Su única responsabilidad es definir donde y como se guarda la información.

Entonces podemos tener varios compoentes, un componente para mensajes, un componente para usuarios.

**componente -> response.js**

5. Para tener todas las respuestas correctas. El módulo network (http) de compontente va a devolver todas las respuestas a través del response.js. Y response el el que response al cliente final.

**response.js -> Internet**

## Rutas y capa de red: Responsabilidades y límites

1. Creamos una carpeta componentes.
2. Creamos una carptea llamada messages dentro de componentes.
3. Dentro de messages creamos el archivo network.js

```javascript
const express = require("express");
const response = require("../response.js");

const router = express.Router();

router.get("/mesages", function (req, res) {
  console.log(req.headers);
  res.heaader({
    "custom-header": "Nuestro valor personalizado",
  });
  response.success(req, res, "Lista de mensajes");
});

router.post("/messages", function (req, res) {
  if (req.query.error == "ok") {
    response.error(req, res, "Error inesperado", 500, "Es solo una simulación");
  } else {
    response.success(req, res, "Creando correctamente", 201);
  }
});

module.exports = router;
```

Creamos un archivo ./network/routes.js y también allí va el archivo de response (./network/response.js)

routes.js

```javascript
const express = require('express');
const message = require('../components/messages/network');

const routes = funcition(server){
  server.use('/message', message);
}

module.exports = routes;
```

En el server.js

```javascript
cons express = require('express');

const router = require('./network/routes');

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(router);

router(app);

app.listen(3000);
console.log('La aplicación está escuchando en http://localhost:3000');
...
```

## Controladores: Definiendo la lógica de negocio

Ya tenemos la capa de red separada. Pero tenemos que hacer los controladores con la lógica de nuestros archivos. Entonces procedemos a crear un archivo en ./components/messages/controller.js

Aquí en el controlador tenemos que trabajar con promesas para indicarle a la network si las cosas han salido bien o mal.

## Almacenando la información en una base de datos

Creamos el archivo store.js, donde se tendrá toda la lógica de almacenamiento.

Lo primero que vamos a hacer es crear un mocks (simulación de una bse de datos) para probar nuestras funciones, rutas y servidor.

# Utilizar una base de datos para definir, modelar, almacenar y recuperar la información de nuestra aplicación

## Tipos de Bases de Datos: Relacionales y No Relacionales

Si hablamos de base de datos, lo más típico y lo más común habría sido mysql. Que era la base de datos que se utilizaba en todas partes. Porque tiene un fit perfecto con php que es un lenguaje muy utilizado en backend. Es una base de datos relacional, al igual que postgres. Una base de datos relacional es básicamente que tiene relaciones y regularmente creamos tablas y columnas dentro de ellas.

**Bases de Datos Realcionales**: No son bases de datos muy flexibles, pero tienen a su favor su gran soporte y el enorme desarrollo en herramientas para su uso. si necesitamos cambiar un valor en un campo debemos hacerlo con todos los cambpos de nuestra DB, en cambio con NoSQL o No Relacional no es así.

**Bases de Datos no Relacionales**: Son bases de datos sin una tabla fija como las que sí se encuentran en las bases de datos relacionales, lo que permite una alta escalalbilidad en ellas. Además es abierta y por lo tanto flexible a diferentes tipos de datos y no necesita tantos recursos para ejecutarse; de hecho el hardware necesario no cuesta mucho.

- Documentos
- Documentos relacionados: MongoDB
- Clave - Valor: Cassandra
- Grafos: Neo4j

## MongoDB: Almacenar y leer datos

Vamos a utilizar mongoose para que nos ayude a validar el esquema de base de datos. Entonces creamos en components/messages/model.js

Instalamos mongoose:

> npm install mongoose

```javascript
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mySchema = new Schema({
  user: String,
  message: {
    type: String,
    required: true,
  },
  date: Date,
});

const model = mongoose.model("Messages", mySchema);
module.exports = model;
```

Luego nos vamos a store.js para cambiar el mock por un modelo real.

```javascript
const db = require("mongoose");
const Model = require("./model");

//mongodb://user:user1234@ds255107.mlab.com:55107/telegrom
db.Promise = global.Promise;
db.connect("mongodb://user:user1234@ds255107.mlab.com:55107/telegrom", {
  useNewUrlParser: true,
});
console.log("[db] Conectada con éxito");

function addMessage(message) {
  const myMessage = new Model(mesage);
  myMessage.save();
}

asyn function getMessage() {
  const messages = await Model.find();
  return messages;
}
```

## MongoDB: Actualizar datos

Pues debemos crear una nueva ruta en el network.js de nuestro componente messages

```javascript
router.patch("/:id", function (req, res) {
  console.log(req.params.id);
  controller.updateMessage(req.params.id, req.body.message).then((data) => {
    response.success(req, res, data 200);
  }).catch((e)=> {
    response.error(req, res, 'Error Interno', 500, e);
  });
  res.send("Ok");
});
```

En el controller.js

```javascript

function updateMessage(id, message) {
  return new Promise( async (resolve, reject) => {
    if (!id || !message) {
      reject('Invalida data');
    }
    const result = await store.updateText(id, message);
    resolve(result);
  })
```

En el store.js

```javascript
async function updateText(id, message) {
  const foundMessage = await Model.findOne({
    _id: id,
  });
  foundMessage.message = message;
  const newMessage = await foundMessage.save();
  return newMessage;
}
```

## MongoDB: Consultar datos

Y aquí es para poder filtrar por usuario. Con req.query.

## MongoDB: Eliminar Datos

Hay que crear el verbo en network.js

```javascript
router.delete("/:id", async (req, res) => {
  controller
    .deleteMessage(req.params.id)
    .then(() => {
      response.success(req, res`Usuario ${req.params.id} eliminado`);
    })
    .catch((e) => {
      response.error(req, res, "Error Interno", 500, e);
    });
});
```

Luego nos vamos al Controller.js

```javascript
function deleteMessage(id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject("Id invalido")
    }
    store.remove(id)
      .then(() => {
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  })
}
```

Luego nos vamos al store.js

```javascript
function removeMessage(id) {
  return Model.deleteOne({ _id: id });
}
```

## Gestionar conexiones a la base de datos desde la API

Aquí el problema es que estamos gestionando la conexión a la base de datos desde el archivo store.js de nuestro componente.
Suele ser una buena práctica compartir la conexión para la API y evitar que se nos llene el pool de conexiones.

Creamos a la altura del server.js un archivo llamado db.js y aquí quitamos el codigo de store.js y lo colocamos en db.js

```javascript
const db = require("mongoose");

db.Promise = global.Promise;}

async function connect() {
  await db.connect("mongodb://...", { useNewUrlParser: true });
  console.log("[db] Conectada con éxito");
}

module.exports = connect
```

Y en el server.js

```javascript
const db = require("./db");

db();
```

# Uso de entidades para crear aplicaciones escalables

## Escalando la arquitectura: Múltiples entidades

Vamos a crear un componente para el usuario, así que creamos un directorio users dentro de components.

Creamos controller.js, model.js, network.js, store.js

Empezamos creando el modelo.

Luego seguimos con el store.

Luego el controller.

Luego el network.

Siempre basandonos en lo que hicimos con el componente anterior de mensajes.

Y pues siempre hay que añadir el componente a las routes en networ/routes.js

## Relacionando nuestras entidades

Y ahora toca cambiar el schema de los mensajes para incluir una relación con el schema de usuario. Esto lo hacemos en component/messages/model.js

```javascript
const mySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "Users",
  },
  message: {
    type: String,
    required: true,
  },
  date: Date,
});
```

Luego editamos el store.js de mensajes para que al recuperar los mensajes también nos devuelva el nombre...

```javascript
async function getMessages(filterUser) {
  return new Promise((resolve, reject) => {
    let filter = {};
    if (filterUser !== null) {
      filter = { user: filterUser };
    }
    const messages = Model.find(filter)
      .populate("user")
      .exec((error, populated) => {
        if (error) {
          reject(error);
        }
        resolve(populated);
      });
  });
}
```

Hay que crear un componete llamado chat, cuyo modelo será:

```javascript
const mySchema = new Schmea({
  users: [
    {
      type: Schema.ObjectId,
      ref: "Users",
    },
  ],
});
```

## Cómo recibir ficheros desde NodeJS

Las subidas de archivos funcionan convirtiendo los archivos a una cadena de bits. Muy parecido al texto. Básicamente estaremos recibiendo una cadena de texto muy grande que debemos guardar como un archivo en el servidor. Esto es cuando enviamos archivos como un multipart. Es una petición como form-data.

Vamos a usar multer:

> npm install multer

En nuestro componente messages/network.js

```javascript
const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("file"), function (req, res) {
  ... //resto del código no se hacen cambios.
});
```

## Guardar el fichero en el servidor

En nuestro componente messages/network.js

```javascript
const upload = multer({
  dest: "public/files/",
});

router.post("/", upload.single("file"), function (req, res) {
  //console.log(req.file);
  controller
    .addMessage(req.body.chat, req.body.user, req.body.message, req.file)
    .then((fullMessage) => {
      response.success(req, res, 201, fullMessage);
    })
    .catch((e) => {
      response.error(
        req,
        res,
        400,
        "Información invalida",
        "Error en el con..."
      );
    });
});
```

Ahora el controlador puede hacer algo con ese file que le enviamos. Vamos a message/controller.js

```javascript
function addMessage(chat, user, message, file) {
  return new Promise((resolve, reject) => {
    if (!chat || !user || !message) {
    reject("Los datos son incorrectos");
    return false;
  }

  let fileUrl = "",
  if (file) {
    fileUrl = `http://localhost:3000/app/file` + file.filename
  }

  const fullMessage = {
    chat: chat,
    user: user,
    date: new Date(),
    file: fileUrl,
  }

  store.add(fullMessage);

  resolve(fullMesssage);
  }
}
```

Y tendríamos que modificar el modelo

```javascript
const mySchema = new Schema({
  chat: {
    type: Schema.ObjectId,
    ref: "Chat",
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  date: Date,
  file: String,
});
```

# Conocer el protocolo de websockets, e implementar comunicación cliente/servidor con SocketIO

## WebSockets: Qué son, por qué son interesantes y cómo usarlos

El protocolo Websocket o wss:// crea un túnel de información entre el usuario y el servidor el cual se quedará abierto hasta que el servido y/o el cliente cierre la conexión para pedir información en tiempo real.

## Manejo de Websockets con NodeJS

Creamos una carpeta nueva para un proyecto nuevo...

> mkdir websockets
>
> npm init -y
>
> touch index.js
>
> npm install express socket.io

En index.js

```javascript
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socke.io")(server);

app.use(express.static("public"));

io.on("connection", function (socket) {
  console.log("Nuevo cliente conectado");
  socket.emit("mensaje", "Bienvenido!");
});

setInterval(function () {
  io.emit("mensaje", "Hola, os escribo a todos");
}, 3000);

server.listen(8080, function () {
  console.log(`Servidor iniciado en http://localhost:8080`);
});
```

Creamos la carpeta public y dentro un index.html. Socket.io crea por default un script llamado socket.io.js

```html
<html>
  <head>
    <script src="/socket.io/socket.io.js"></script>
  </head>
  <body>
    <h1>Mira la consola</h1>
    <script>
      var socket = io.connect("http://localhost:8080", {
        forceNew: true,
      });

      socket.on("mensaje", function (data) {
        console.log(data);
      });
    </script>
  </body>
</html>
```

## Conectar la API al servidor de WebSockets

Reorganizamos un poco el server.js

```javascript
const express = require("express");
const app = express();
const server = require("http").Server(app);

const router = require("./network/routes");
const db = require("./db");

db();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router(app);

app.use("/app", express.static("public"));

//app.listen(3000);
server.listen(3000, function () {
  console.log("Server listening on http://localhost:3000");
});
```

Creamos un archivo al mismo nivel de server.js, lo llamamos socket.js. Este archivo iniciliza socket.io, genera una instancia y la comparte.

> npm install socket.io

```javascript
const socketIO = require("socket.io");
const socket = {};

function connect(server) {
  socket.io = socketIO(server);
}

module.exports = {
  connect,
  socket,
};
```

Volvemos al server.js

```javascript
const express = require("express");
const app = express();
const server = require("http").Server(app);

const router = require("./network/routes");
const socket = require("./socket");
const db = require("./db");

db();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

socket.connect(server);

router(app);

app.use("/app", express.static("public"));

//app.listen(3000);
server.listen(3000, function () {
  console.log("Server listening on http://localhost:3000");
});
```

Ahora, nos vamos al controlador de mensajes...

```javascript
...
const socket = require("../../socket").socket;

function addMessage(chat, user, message, file) {
  return new Promise((resolve, reject) => {
    if (!chat || !user || !message) {
    reject("Los datos son incorrectos");
    return false;
  }

  let fileUrl = "",
  if (file) {
    fileUrl = `http://localhost:3000/app/file` + file.filename
  }

  const fullMessage = {
    chat: chat,
    user: user,
    date: new Date(),
    file: fileUrl,
  }

  store.add(fullMessage);

  socket.io.emit("message", fullMessage);

  resolve(fullMesssage);
  }
}
```

Ahora creamos en la carpeta public un archivo socket.html

```html
<html>
  <head>
    <script src="/socket.io/socket.io.js"></script>
  </head>
  <body>
    <h1>Mira la consola</h1>
    <script>
      var socket = io.connect("http://localhost:3000", {
        forceNew: true,
      });

      socket.on("message", function (data) {
        console.log(data);
      });
    </script>
  </body>
</html>
```

# Revisión de lo aprendido, y próximos pasos

## Revisión y próximos pasos

Siempre hay que instalar cors

> npm install cors

Nuevamente en server.js

```javascript
const express = require("express");
const app = express();
const server = require("http").Server(app);

const cors = require("cors");
const router = require("./network/routes");
const socket = require("./socket");
const db = require("./db");

db();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

socket.connect(server);

router(app);

app.use("/app", express.static("public"));

//app.listen(3000);
server.listen(3000, function () {
  console.log("Server listening on http://localhost:3000");
});
```

## Tips para escalar nuestro proyecto

En server.js tenemos un montón de información que tal vez no debería de ir allí.

Así que mejor creemos un archivo config.js

```javascript
const config = {
  dbUrl: "url-de-mongodb",
};

module.exports = config;
```

Y luego desde server.js

```javascript
const config = require("./config");

db(config.dbUrl);
```

También se puede utilizar las variables de entorno:

```javascript
const config = {
  dbUrl: process.env.DB_URL || "url-de-mongo";
  port: process.env.PORT || 3000,
  host: process.env.HOST || "http://localhost",
  publicRoute: process.env.PUBLIC_ROUTE || "/app"
};

module.exports = config;
```

También podemos crear un objeto statusMessage

```javascript
const statusMessage = {
  200: "Done",
  201: "Created",
  400: "Invalid format",
  500: "Server Error",
};
```

> npm install dotenv
