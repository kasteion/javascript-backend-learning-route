# Curso Práctico de Node.js

## Arquitectura de un backend complejo

Crear un backend complejo, orientado a microservicios, separando todas las arquitecturas. Creando servicios para almacenar datos, hacer despliegues serverless.

La idea es separar los servicios en capa de red, capa de controlador y capa de acceso a base de datos.

Estructura de carpetas:

- store
- network
- config
- microservice
  - network
  - controller
  - security o secure (Para manejar las reglas de seguridad)
  - index.js

## Estructuras de datos para nuestro proyecto

Vamos a construir una red social con usuarios y posts.

- Un usuario puede publicar n posts. Es una relación uno a muchos.
- Un usuario puede seguir a otro usuario. Es una relación muchos a muchos.
- Un usuario puede dar likes a posts y el post puede tener likes de muhcos usuarios. Es una relación muchos a muchos.

Las tablas serían:

- User:

  - id
  - nombre
  - username

- Posts:

  - id
  - user (FK User id)

- User_Follow:

  - From (FK User id)
  - To (FK User id)

- Post_Like:

  - Post id (FK Post id)
  - User id (FK User id)

- Auth: (Una tabla separada de usuario para manejar la autenticación)
  - id
  - user
  - password

# Creando la estructura principal

## Estructura inicial del proyecto: API y rutas

> mikdir backend-node
>
> cd backend-node
>
> npm init
>
> npm install express

Creamos un archivo ./config.js

```javascript
module.exports = {
  api: {
    port: process.env.API_PORT || 3000,
  },
};
```

Creamos la carpeta ./api y dentro el archivo ./api/index.js

```javascript
const express = require("express");

const config = require("../config.js");
const user = require("./components/user/network");

const app = express();

// Routes
app.user("/api/user", user);

app.listen(config.api.port, () => {
  console.log("API Listening on port", config.api.port);
});
```

Creamos la carpeta ./api/component/user y dentro el archivo ./api/component/user/network.js

```javascript
const express = require("express");

const router = express.Router();

router.get("/", function (req, res) {
  res.send("Todo funciona");
});

module.exports = router;
```

> nodemon api/index.js

Creamos la carpeta ./network y dentro el archivo ./network/response.js

Este archivo es para manejar todas las respuestas desde el mismo archivo.

```javascript
export.success = function (req, res, message, status = 200) {
    res.status(status).send({
        error: false,
        status: status,
        body: message
    })
}

export.error = function (req, res, message = "Internal Server Error", status = 500) {
    res.status(status).send({
        error: true,
        status: status,
        body: message
    })
}
```

Entonces podemos cambiar el archivo ./api/component/user/network.js

```javascript
const express = require("express");

const response = require("../../../network/response");

const router = express.Router();

router.get("/", function (req, res) {
  // res.send("Todo funciona");
  response.success(req, res, "Todo funciona correctamente", 200);
});

module.exports = router;
```

## Aislar el código de la base de datos

Ahora debemos aislar el código de datos para que no esté mezclado con la lógica de negocios. Entonces creamos una carpeta ./store y un archivo ./store/dummy.js

```javascript
const db = {
  user: [
    {
      id: 1,
      name: "user01",
    },
  ],
};

function list(tabla) {
  return db[tabla];
}

function get(tabla, id) {
  const col = list(tabla);
  return col.filter((item) => item.id === id)[0] || null;
}

function upser(tabla, data) {
  db[tabla].push(data);
}

function remove(tabla, id) {
  return true;
}

module.exports = {
  list,
  get,
  upsert,
  remove,
};
```

Ahora, la conexión no la podemos hacer desde el archivo network porque este archivo solo es para trabajar con la capa de red, así que creamos un archivo controller en ./api/components/user/controller.js

```javascript
const store = require("../../../store/dummy");

const TABLE = "user";

function list() {
  return store.list(TABLE);
}

module.exports = {
  list,
};
```

Y ahora en ./api/component/user/network.js puedo

```javascript
const express = require("express");

const response = require("../../../network/response");
// 1. Traernos el controller
const controller = require("./controller");

const router = express.Router();

router.get("/", function (req, res) {
  // 2. Utilizar el controler aquí
  const lista = controller.list();
  response.success(req, res, lista, 200);
});

module.exports = router;
```

## Rutas para usuarios

Ya tenemos aislada la lógica de negocios y la lógica de datos para que los cambios en base de datos no afecten la lógica de negocios y los cambios en la lógica no deberían requerir cambios en la base de datos.

Ahora nuestro controlador no debería requerir automaticamente que siempre sea esa su base de datos. Esto es útil para la parte de testing. Entonces podemos crear el controlador como un constructor al que le inyectamos la dependencia de la base de datos... para esto creamos un archivo ./api/components/user/index.js

```javascript
const store = require("../../../store/dummy");
const controller = require("./controller");

// De esta forma tendrémos el controllador como una función a la que le inyectamos el store... pero nuestro controlador actual no es una función...
module.exports = controller(store);
```

Entonces en ./api/components/user/controller.js

```javascript
// const store = require("../../../store/dummy");

const TABLE = "user";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  function list() {
    return store.list(TABLE);
  }

  return {
    list,
  };
};
```

Y ahora en ./api/component/user/network.js puedo

```javascript
const express = require("express");

const response = require("../../../network/response");
// 1. Cambiamos el require de controller a index
const controller = require("./index");

const router = express.Router();

router.get("/", function (req, res) {
  const lista = controller.list();
  response.success(req, res, lista, 200);
});

// 2. Agregamos más rutas
router.get("/:id", function (req, res) {
  const user = controller.get(req.params.id);
  response.success(req, res, user, 200);
});

module.exports = router;
```

Ahora las funciones de acceso a la base de datos pueden ser asíncronas pues estas operaciones pueden tardar un poco

```javascript
const db = {
  user: [
    {
      id: 1,
      name: "user01",
    },
  ],
};

async function list(tabla) {
  return db[tabla];
}

async function get(tabla, id) {
  const col = await list(tabla);
  return col.filter((item) => item.id === id)[0] || null;
}

async function upser(tabla, data) {
  db[tabla].push(data);
}

async function remove(tabla, id) {
  return true;
}

module.exports = {
  list,
  get,
  upsert,
  remove,
};
```

Y entonces en network.js recibiríamos promesas... por lo que

```javascript
const express = require("express");

const response = require("../../../network/response");
const controller = require("./index");

const router = express.Router();

router.get("/", function (req, res) {
  controller
    .list()
    .then((lista) => {
      response.success(req, res, lista, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, 500);
    });
});

// 2. Agregamos más rutas
router.get("/:id", function (req, res) {
  controller
    .get(req.params.id)
    .then((user) => {
      response.success(req, res, user, 200);
    })
    .catch((err) => {
      response.success(req, res, err.message, 500);
    });
});

module.exports = router;
```

## Documentación de nuestra API

Utilizar nanoid para generar ids y body-parser creo que está incluído en express.

También seaprar las rutaas y las funciones así:

```javascript
router.get("/", list);

const list = (req, res) => {
  controller
    .list()
    .then((lista) => {
      response.success(req, res, lista, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, 500);
    });
};
```

En la url https://editor.swagger.io/ podemos trabajar el swagger de nuestra api.

El archivo de nuestra documentación lo podemos descargar como json. Y este lo podemos incluir en nuestro proyecto. En un archivo ./api/swagger.json

Y en el archivo ./api/index.js

```javascript
const swaggerUi = require("swagger-ui-express");

const swaggerDoc = require("./swagger.json");
app.use("/api-doc", swaggerUi.server, swaggerUi.setup(swaggerDoc));
```

> npm install swagger-ui-express

# Autenticación basada en tokens

## JWT: Gestión de acceso

A la función de editar el usuario cualquiera puede acceder pero queremos que un usuario solo pueda editar su propia información, para esto debemos añadir una capa de atenticación... es importante entender la diferencia entre la autenticación y la autorización.

Para la parte de autenticación vamos a trabajar con JWT.

https://jwt.io/

Un Token JWT tiene tres partes.

- Header: Define el algoritmo de encriptación y el tipo.
- Payload: Es la data del token. El usuario, el tiempo en que vence.
- Verify Signature: Aquí pues va un secret que es el que nos sirve para descifrar del lado del servidor. Este secret no debe ir en el código ni en repo.

No reinventes la rueda, especialmente en temas de seguridad...

## Autenticación: registro

Primero debemos crear nuestros usuarios para poder hacer el login, el flujo sería meter el usuario y contraseña, se hace el login y devolvemos el login.

La password se puede manejar en muchos sitios pero lo mejor es no guardarla en la misma tabla de los usuarios para mantener separada la autenticación y los datos del usuario. Para que cuando hacemos consultas pues no tengamos que preocuparnos de que no venga la password.

Creamos una nueva carpeta ./api/components/auth y dentro index.js

```javascript
const store = require("../../../store/dummy");
const controller = require("./controller");

module.exports = controller(store);
```

Creamos también controller.js

```javascript
const TABLE = "auth";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  const insertOne = (data) => {
    const authData = {
      id: data.id,
    };

    if (data.username) {
      authData.username = data.username;
    }

    if (data.password) {
      authData.password = data.password;
    }

    return store.upsert(TABLA, authData);
  };

  return {
    insertOne,
  };
};
```

En el controller del user tambien tengo que crear el auth...

```javascript
const auth = require("../auth");

if (body.password || body.username) {
  await auth.upser({
    id: user.id,
    username: body.username,
    password: body.password,
  });
}
```

## Autenticación: login

No tenemos que guardar las contraseñas en limpio... sino que debemos guardarlas como un hash...

En el controller de auth creamos la función de login

```javascript
const auth = require("../../../auth");
const TABLE = "auth";

module.exports = function (injectedStore) {
  // Resto del código

  function login(username, password) {
    const data = await store.query(TABLA, { username: username });
    if (data.password === password) {
      // Generar token;
      // return "TOKEN";
      return auth.sign(data);
    } else {
      throw new Error("Invalid information");
    }
  }
};
```

En el store dummy.js deberíamos implementar

```javascript
async function query(tabla, q) {
  let col = await list(tabla);
  let keys = Object.keys(q);
  let key = keys[0];
  return col.filter((item) => item[key] === q[key])[0] || null;
}
```

Y pues también tenemos que implementar el network de auth

```javascript
router.post("/login", function (req, res) {
  controller
    .login(req.body.username, req.body.password)
    .then((token) => {
      response.success(req, res, token, 200);
    })
    .catch((err) => {
      response.error(req, res, "Invalid information", 400);
    });
});
```

Y tenemos que añadirlo al archivo principal de la api ./api/index.js

```javascript
const auth = require("./components/auth/network");

app.use("/api/auth", auth);
```

Para generar el token creamos la carpeta ./auth y dentro index.js

```javascript
const jwt = require("jsonwebtoken");

function sign(data) {
  return jwt.sign(data, "secreto");
}

module.exports = {
  sign,
};
```

> npm install jsonwebtoken

## Autenticación: cifrar contraseñas para evitar problemas de seguridad

Ahora necestamos utilizar librerías de criptografía para cifrar las contraseñas.

> npm install bcrypt

Y así ahora en el controller de auth

```javascript
const bcrypt = require("bcrypt");

async function upsert(data) {
  const authData = {
    id: data.id,
  };

  if (data.username) {
    authData.username = data.username;
  }

  if (data.password) {
    // Aquí hashamos nuestro password para que guarde un hash en lugar de la contraseña, entre 5 y 10 veces
    authData.password = await bcrypt.hash(data.password, 5);
  }

  return store.upsert(TABLA, authData);
}

async function login(username, password) {
  const data = await store.query(TABLA, { username: username });
  // Esto devuelve una promesa
  return bcrypt.compare(password, data.password).then((sonIguales) => {
    if (sonIguales === true) {
      return auth.sign(data);
    } else {
      throw new Error("Invalid information");
    }
  });
}
```

## Autenticación: gestión de permisos

Ahora debemos poder descifrar el token para saber quien es el usuario y saber si tiene permisos. Hay que introducir un middleware de autenticación. Una buena idea suele ser no permitir pasar a la lógica del componente si no tienes permisos...

Entonces dentro del componente user podemos crear un archivo llamado secure.js

```javascript
const auth = require("../../../auth");

module.exports = function checkAuth(action) {
  // Esta función tiene que devolver una una nueva función

  function middleware(req, res, next) {
    switch (action) {
      case "update":
        const owner = req.body.id;
        auth.check.own(req, owner);
        next();
        break;
      default:
        next();
    }
  }

  return middleware;
};
```

Luego en ./auth/index.js

```javascript
const jwt = require("jsonwebtoken");
const config = require("../config.js");

const secret = config.jwt.secret;

function sign(data) {
  return jwt.sign(data, secret);
}

function verify(token) {
  return jwt.verify(token, secret);
}

// Creamos la función check que estamos llamado
const check = {
  own: function (req, owner) {
    // Aquí verificamos...primero debemos decodificar el header
    const decoded = docodeHeader(req);
    // Solo para ver que este decodificando bien el token
    console.log(decoded);
  },
};

function getToken(auth) {
  // Bearer kajsdfkajsdfkajsdkfjaskdfjalsñdf
  if (!auth) {
    throw new Error("There is no token");
  }

  if (auth.indexOf("Bearer ") === -1) {
    throw new Error("Invalid format");
  }
  let token = auth.replace("Bearer ", "");
  return token;
}

function decodeHeader(req) {
  const authorization = req.header.authorization || "";
  const token = getToken(authorization);
  const decoded = verify(token);
  req.user = decoded;
  return decoded;
}

module.exports = {
  sign,
};
```

Y entonces en el config.js tiene que ir

```javascript
module.exports = {
  api: {
    port: process.env.NODE_PORT || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "NoTanSecret!",
  },
};
```

## Comprobar verificación con token

Hasta aquí tenemos el token y lo estamos desencriptando pero no estamos revisando los permisos eso se haría en ./auth/index.js

```javascript
const jwt = require("jsonwebtoken");
const config = require("../config.js");

const secret = config.jwt.secret;

function sign(data) {
  return jwt.sign(data, secret);
}

function verify(token) {
  return jwt.verify(token, secret);
}

const check = {
  own: function (req, owner) {
    // Aquí verificamos...primero debemos decodificar el header
    const decoded = docodeHeader(req);
    // Solo para ver que este decodificando bien el token
    console.log(decoded);
    // Comprobar si es o no propio
    if (decoded.id !== owner) {
      throw new Error("No puede hacer esto");
    }
  },
};

function getToken(auth) {
  if (!auth) {
    throw new Error("There is no token");
  }

  if (auth.indexOf("Bearer ") === -1) {
    throw new Error("Invalid format");
  }
  let token = auth.replace("Bearer ", "");
  return token;
}

function decodeHeader(req) {
  const authorization = req.header.authorization || "";
  const token = getToken(authorization);
  const decoded = verify(token);
  req.user = decoded;
  return decoded;
}

module.exports = {
  sign,
  check,
};
```

Y en el network de usuarios agregamos el middleware que creamos en secure.js

```javascript
const secure = require("./secure");

// Este middleware va en las rutas
router.put("/", secure("update"));
```

## Gestión avanzada de errores: Throw

Ahora cada vez que tenemos un error nos está dando toda la traza del error y esto es un problema también de seguridad. Primero debemos gestionar todos los errores desde un mismo lugar así que en ./network creamos un archivo errors.js

```javascript
const resposne = require("./response");

function errors(err, req, res, next) {
  console.error("[Error]", err);
  const message = err.message || "Internal Error";
  const status = err.statusCode || 500;
  response.error(req, res, message, status);
}

module.exports = errors;
```

Y ahora en el index.js dentro de ./api podemos utilizar este middleware

```javascript
const errors = require("../network/errors");

// Y este middleware va hasta el final antes del listen

app.use(errors);
app.listen(config.api.port, () => {
  console.log("Listening on port 3000");
});
```

Vamos a crear una carpeta ./utils y un archivo errors.js para crear errores personalizados...

```javascript
function err(message, code) {
  let e = new Error(message);
  if (code) {
    e.statusCode = code;
  }
  return e;
}

module.exports = err;
```

Y ahora hay que buscar todos los archivos en que lanzo un new Error...

```javascript
const error = require("../utils/error");

// Remplazar los throw new Error("No puedes hacer esto") por
throw error("No puedes hacer esto", 401);
```

De esta forma podemos hacer que todos los errores de nuestra aplicación en lugar de arrojar un 500 arroje errores coherentes, sin dar la traza del error.

# Almacenando datos: MySql

## Base de datos real: MySQL

Ahora en lugar de utilzar la base de datos dummy vamos a utilizar mysql entonces en ./store vamos a agregar un archivo mysql.js

```javascript
// Instalemos esta dependencia
const mysql = require("mysql");
const config = require("../config");

// Tenemos que agregar datos al config
const dbconf = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
};

let connection;

function handleCon() {
  connection = mysql.createConnection(dbconf);
  connection.connect((err) => {
    if (err) {
      console.error("[DB Error]", err);
      setTimeout(handleCon, 2000);
    } else {
      console.log("DB Connected!");
    }
  });

  connection.on("error", (err) => {
    console.error("[DB Error]", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleCon();
    } else {
      throw err;
    }
  });
}

handleCon();

function list(table) {
  return new Promis((resolve, reject) => {
    connection.query(`SELECT * FROM ${TABLE}`, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
}

module.exports = {
  list,
};
```

El config.js quedaría así:

```javascript
module.exports = {
  api: {
    port: process.env.NODE_PORT || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "NoTanSecret!",
  },
  mysql: {
    host: process.env.MYSQL_HOST || "",
    user: process.env.MYSQL_USER || "",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "",
  },
};
```

> npm install mysql

Hay un sitio que se llama https://remotemysql.com allí podemos crear una free remote mysql database

Ahora en cada uno de los components en el index.js puedo cambiar la llamada al store.

## Completando la base de datos

Aquí es necesario terminar de trabajar el store para mysql creando las mismas funciones que nuestro dummy.js

```javascript
const mysql = require("mysql");

const config = require("../config");

const dbconf = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
};

let connection;

function handleCon() {
  connection = mysql.createConnection(dbconf);

  connection.connect((err) => {
    if (err) {
      console.error("[db err]", err);
      setTimeout(handleCon, 2000);
    } else {
      console.log("DB Connected!");
    }
  });

  connection.on("error", (err) => {
    console.error("[db err]", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleCon();
    } else {
      throw err;
    }
  });
}

handleCon();

function list(table) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table}`, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function get(table, id) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function insert(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function update(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET ? WHERE id=?`,
      [data, data.id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}

function upsert(table, data) {
  if (data && data.id) {
    return update(table, data);
  } else {
    return insert(table, data);
  }
}

function query(table, query) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE ?`, query, (err, res) => {
      if (err) return reject(err);
      resolve(res[0] || null);
    });
  });
}

module.exports = {
  list,
  get,
  upsert,
  query,
};
```

## Relacionando entidades: follow

Primero es necesario crear la tabla intermedia para relacionar quien sigue a quien.

Agregamos al network.js de user la ruta para follow

```javascript
const follow = (rq, res, next) => {
  // El next es para que en caso de error siga a la siguiente ruta que lo pueda antender que en clases anteriores debería ser la ruta de manejo de errores... eso habría que hacerlo en los otros también.

  controller
    .follow(req.user.id, req.params.id)
    .then((data) => {
      response.success(req, res, data, 201);
    })
    .catch(next);
};

router.post("/follow/:id", secure("follow"), follow);
```

Lo que significa que a la parte de user/secure.js hay que agregarle una verificación...

```javascript
const checkAuth = (action) => {
  const middleware = (req, res, next) => {
    switch (action) {
      case "update":
        const owner = req.body.id;
        auth.check.own(req, owner);
        next();
        break;
      // Esto es lo que queremos verificar
      case "follow":
        auth.check.logged(req);
        next();
        break;
      default:
        next();
    }
  };

  return middleware;
};
```

Y eso también significa que hay que agregar en ./auth/index.js

```javascript
const check = {
  own: function (req, owner) {
    const decoded = decodeHeader(req);
    if (decoded.id !== owner) throw error("You can't do this", 401);
  },
  logged: function (req) {
    const decoded = decodeHeader(req);
  },
};
```

Y claro en el controller.js de user hay que crear la función follow

```javascript
const follow = (from, to) => {
  store.upsert(TABLE + "_follow", { user_from: from, user_to: to });
};
```

Ahora hay que contruir una función que devuelva a quién sigue el usuario con id que viene en mi token ( que sería mi usuario autenticado)

network.js del user...

```javascript
router.get("/:id/following", following);

function following(req, res, next) {
  return controller
    .following(req.params.id)
    .then((data) => {
      return response.success(req, res, data, 200);
    })
    .catch(next);
}
```

Y en el controller

```javascript
async function following(user) {
  const join = {};
  join[TABLA] = "user_to"; // { user: "user_to" }
  const query = { user_from: user };
  return await store.query(TABLA + "_follow", query, join);
}
```

Y en el store de mysql.js

```javascript
function query(table, query, join) {
  let joinQuery = "";
  if (join) {
    const key = Object.keys(join)[0];
    const val = join[key];
    joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
  }

  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`,
      query,
      (err, res) => {
        if (err) return reject(err);
        resolve(res[0] || null);
      }
    );
  });
}
```

## Post y likes

Ahora creamos en components una carpeta llamada posts y dentro sus respectivos archivos network.js, controller.js, index.js

Con las functiones list, añadir post, leer un post por id, editar un post.

# Microservicios en Node

## Microservicios: pros y contras

Tenemos ya un backend con una api y sus componentes listos para empezar a trabajar. Si trabajamos sobre el mismo proyecto vamos a terminar con un servicio muy grande. Nosotros quisieramos no tener servicios demasiado grandes y para eso estaría la arquitectura de microservicios.

El problema es que si tenemos un servicio muy grande y se cae el único hilo de node se nos cae todo... Otra cosa es que puede haber partes de nuestro proyecto que se utilicen más que otras no podríamos escalarlo por servicio sino que solo podemos levantar un solo api...

Entonces podríamos tener una api, un servicio de posts, mensajes, para subir fotos, un servicio para hacer comprobaciones.

El problema sería como orquestamos que todo esto funcione.

## Separando la base de datos a un microservicio

Lo primero que podemos separar en un microservicio es la base de datos. Tal vez ahora solo tenemos esta aplicación pero si queremos que otro servicios en otros lenguajes le peguen a la base de datos podemos hacerlo por medio de un microservicio de base de datos.

Creamos una carpeta ./mysql y dentro un index.js en el cual definimos una api para poder acceder.

```javascript
const express = require("express");

const config = require("../config");

const app = express();
app.use(express.json());

app.listen(config.mysqlService.port, () => {
  console.log(
    "Servicio de mysql escuchando en el puerto",
    config.mysqlService.port
  );
});
```

Y en el network.js

```javascript
const express = require("express");

const response = require("../../../network/response");
const store = require("../store/mysql");

const router = express.Router();

const list = async (req, res, next) => {
  const datos = await store.list(req.params.table);
  response.success(req, res, datos, 200);
};

const get = async (req, res, next) => {
  const datos = await store.get(req.params.table, req.params.id);
  response.success(req, res, datos, 200);
};

const insert = async (req, res, next) => {
  const datos = await store.insert(req.params.table, req.body);
  response.success(req, res, datos, 200);
};

const upsert = async (req, res, next) => {
  const datos = await store.upsert(req.params.table, req.body);
  response.success(req, res, datos, 200);
};

router.get("/:tabla", list);
router.get("/:tabla/:id", get);
router.post("/:tabla", insert);
router.put("/:tabla", upsert);

module.exports = router;
```

> nodemon mysql/index.js

Esta clase de servicio es útil si tenemos la posibilidad de no exponer microservicios al público, este lo podríamos tener de forma privada.

## Conectando con nuestro microservicio de datos

Acabamos de crear un servicio para la base de datos. Ahora lo que tenemos que hacer para conectarnos desde los otros servicios es por medio de un fichero que permita no cambiar nada más en nuestros otros servicios.

En lugar de crear un archivo especifico para cada base de datos vamos a crear un constructor de base de datos remotas y un archivo que genere nuestra base de datos remota, como lo hicimos en los controlers y en index.js

> npm install request

En ./store vamos a crear un archivo remote.js

```javascript
const request = require("request");

function createRemoteDB(host, port) {
  const URL = "http://" + host + ":" + port;

  function req(method, table, data) {
    let url = URL + "/" + table;
    body;
    return new Promise((resolve, reject) => {
      request(
        {
          method,
          headers: {
            "content-type": "application/json",
          },
          url,
          body,
        },
        (err, req, body) => {
          if (err) {
            console.error("Error con la base de datos remota", err);
            return reject(err.message);
          }
          const resp = JSON.Parse(body);
          return resolve(resp.body);
        }
      );
    });
  }

  function list(table) {
    return req("GET", table);
  }

  function get(table, id) {}
  function upsert(table, data) {}
  function query(table, query, join) {}

  return {
    list,
    get,
    upsert,
    query,
  };
}

module.exports = createRemoteDB;
```

Ahora creamos un archivo ./store/remote-mysql.js

```javascript
const remote = require("./remote");
const config = require("../config");

module.expotrs = new remote(config.mysqlService.host, config.mysqlService.port);
```

En el config

```javascript
mysqlService: {
  host: process.env.MYSQL_SRV_HOST || "localhost",
  port: process.env.MYSQL_SRV_PORT || 3001,
}
```

Ahora podemos en el index.js de los servicios en donde hacemos el inject del store...

```javascript
// const store = require("../../../store/mysql");
const store = require("../../../store/remote-mysql");
const controller = require("./controller");

module.exports = controller(store);
```

Ahora debemos ejecutar

> nodemon mysql/index.js
>
> nodemon api/index.js

## Separando los posts a un microservicios

En algunos entornos (cuando tenemos que exponer todo por http o todo tiene que estar expuesto) lo que podemos hacer es separar los microservicios de forma vertical (api, base de datos, cache).

Otra cosa que se suele hacer es dividir en auth, users, posts... como separandolo de forma horizontal.

Vamos a separar los posts...

Creamos una carpeta para nuestros posts sería ./posts y dentro index.js

```javascript
const express = require("express");

const config = require("../config");
const errors = require("../network/errors");
const post = require("./network");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/post", post);

app.use(errors);
app.listen(config.post.port, () => {
  console.log("Listening on port", config.post.port);
});
```

Y habría que quitar posts de la api... de esta forma tendríamos un servicio de api que hace auth y usuarios. Y otro que solo hace lo de los posts.

Entonces terminaríamos con 3 servicios, una api general, uno de DB y otro de posts.

## Gestión de microservicios con PM2

Ahora podemos llegar a tener muuchos microservicios, 15, 20, 30 microservicios y no podemos a mano gestionar nuestros microservicioes en producción.

Con pm2 podemos gestionar nuestros microservicios.

pm2 es un gestor de procesos para nodejs hecho por la gente de keymetrics. Se instala con

> npm install -g pm2

Para ver logs dentro de nuestro pm2

> pm2 logs

Para ver los procesos que tenemos activos

> pm2 status

Para crear un primer proceso

> pm2 start api/index.js

Iniciemos los otros procesos

> pm2 start mysql/index.js
>
> pm2 start post/index.js

Aquí ya tenemos los procesos corriendo como un servicio si un proceso se muere pm2 se encarga de reiniciarlo.

Con pm2 logs vemos los logs de todos los servicios pero podemos hacer esto para ver los servicios del cervicio con algun id

> pm2 logs 0

pm2 mete los logs en un archivo index.logs siempre porque el archivo que terminamos corriendo se llama index.js pero podemos cambiarle a index.mysql.js e index.posts.js

Para detener servicios

> pm2 stop 0

O para detener varios al mismo tiempo

> pm2 stop 0 1

Para reiniciar un servicio

> pm2 restar 3

# Puesta en producción serverless

## Microservicios en Vercel, serverless y seguridad

Con pm2 es para cuando vamos a desplegar en máquinas virtuales o algo así. Pero también podemos hacerlo serverless.

> vercel

Creamos un archivo ./vercel.json (o now.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@now/node"
    },
    {
      "src": "posts/index-post.js",
      "use": "@now/node"
    }
  ],
  "routes": [
    {
      "src": "/api/auth(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/api/user(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "api/post(.*)",
      "dest": "/api/index-post.js"
    }
  ]
}
```

## Variables de entorno en Vercel y despliegue local

```json
{
  "version": 2,
  "env": {
    "MYSQL_HOST": "remotemysql.com"
  },
  "builds": [
    {
      "src": "api/index.js",
      "use": "@now/node"
    },
    {
      "src": "posts/index-post.js",
      "use": "@now/node"
    }
  ],
  "routes": [
    {
      "src": "/api/auth(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/api/user(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "api/post(.*)",
      "dest": "/api/index-post.js"
    }
  ]
}
```

> now dev

o

> vercel dev

# Cacheando nuestra aplicación

## Caché con un microservicio, Redis

Como crear un caché. Es una forma más rápida para servir contenido que ya conocemos. Es una memoria, en lugar de consultar a la base de datos consultamos al caché y si está en memoria respondemos desde allí y si no pues vamos a la base de datos.

Redis es una base de datos en memoria, se puede usar como caché, se le puede configurar persistencia en disco aunque esto no tiene tanto sentido...

Creamos una nueva carpeta... ./cache y dentro index-cache.js

```javascript
const express = require("express");

const config = require("../config");
const router = require("./network");

const app = express();

app.use(express.json());

app.use("/", router);

app.isten(config.cacheService.port, () => {
  console.log(
    "Servicio de mysql escuchando en el prueto",
    config.cacheService.port
  );
});
```

Y creamos un network.js

```javascript
const express = require("express");

const response = require("../network/response");
const store = require("../store/redis");

const router = express.Router();

router.get("/:table", list);
router.get("/:table/:id", get);
router.put("/:table", upsert);

async function list(req, res, next) {}
async function get(req, res, next) {}
async function upsert(req, res, next) {}
```

Creamos un archivo ./store/redis.js y un ./store/remote-cache.js (como el remote-mysql.js)

## Conectando el microservicio a Redis

Primero necesitamos un servidor de redis, podemos descargarlo e instalarlo local... redislabs.com podemos utilizar una prueba gratuita. Una base de datos gratuita de 30MB.

> npm install redis

Y ahora si trabajamos en ./store/redis.js

```javascript
const redis = require("redis");

const config = require("../config");

const client = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

function list(table) {
  return new Promise((resolve, reject) => {
    client.get(table, (err, data) => {
      if (err) return reject(err);
      // Redis es una base de datos clave valor, vamos a convertir de string a objeto

      let res = data || null;
      if (data) {
        res = JSON.parse(data);
      }
      resolve(res);
    });
  });
}

function get(table, id) {
  /* Muy parecida a list */
}

function upsert(table, data) {
  let key = table;
  if (data && data.id) {
    key = key + "_" + data.id;
  }
  // Para setear tiempo de expiración de caché
  client.setex(key, 30, JSON.stringify(data));
  return true;
}

module.exports = {
  list,
  get,
  upsert,
};
```

## Conectar la API al caché

Nos vamos a ./api/components/users/controller.js

```javascript
const TABLE = "users";

// Aquí también tendríamos que injectar el cache
module.exports = function (injectedStore, injectedCache) {
  let store = injectedStore;
  let cache = injectedCache;
  if (!store) {
    store = require("../../../store/dummy");
  }
  if (!cache) {
    cache = require("../../../store/dummy");
  }

  const getAll = async () => {
    let users = await cache.list(TABLE);
    if (!users) {
      users = await store.getAll(TABLE);
      cache.upsert(TABLE, users);
    }
    // return store.getAll(TABLE);
    return users;
  };

  const getOne = (id) => {
    return store.getOne(TABLE, id);
  };

  const insertOne = async (user) => {
    return store.insertOne(TABLE, user);
  };

  const deleteOne = (id) => {
    return store.deleteOne(TABLE, id);
  };

  const updateOne = (user) => {
    return store.updateOne(TABLE, user);
  };

  return {
    getAll,
    getOne,
    insertOne,
    deleteOne,
    updateOne,
  };
};
```

Y en el index.js

```javascript
//const store = require("../../../store/dummy");
const config = require("../../../config");

let store, cache;
if (config.remoteDB === true) {
  store = require("../../../store/remote-mysql");
  cache = require("../../../store/remote-cache");
} else {
  store = require("../../../store/mysql");
  store = require("../../../store/redis");
}

const controller = require("./controller");

module.exports = controller(store, cache);
```

# Puesta en producción en Virtual Machine

## Desplegando los servicios de Node

Estos servicios ahora hay que levantarlos en un servidor... existen muchas razones por las cuales quisieramos instalarlos en una vm

> cd ~
>
> curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
>
> sudo bash nodesource_setup.sh
>
> sudo apt-get install -y nodejs
>
> nodejs -V
>
> sudo apt-get install git
>
> sudo npm install -g pm2
>
> git clone https://github.com/kasteion...
>
> cd backend-node
>
> npm install
>
> pm2 status
>
> pm2 start mysql/index-mysql.js
>
> pm2 start cache/index-cache.js
>
> pm2 start api/index.js
>
> pm2 start post/index-post.js

## Nginx como proxy inverso

Exponer direactamente node en el puerto 3000 es inseguro y dara problemas pero podemos utilizar nginx como proxy inverso

> sudo apt-get install nginx
>
> sudo service nginx start
>
> sudo service nginx stop
>
> sudo vim /etc/nginx/sites-available/default

```
# Buscamos location /
location / {
  try_files $uri $uri/ =404;
}

location /api/user {
  proxy_pass http://localhost:3000;
}

location /api/auth {
  proxy_pass http://localhost:3000;
}

location /api/post {
  proxy_pass http://localhost:3002;
}
```

> sudo service nginx restart
