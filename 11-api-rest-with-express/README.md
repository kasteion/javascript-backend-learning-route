# ¿Qué es Express.js?

Es un miniframework que corre sobre nodejs.

El proyecto es desarrollar una tienda online.

## Configuración del entorno de Desarrollo

> mkdir my-store

> cd my-store

> code .

> npm init -y

> git init

> touch .gitignore

Sacar el contenido del gitignore de https://gitignore.io

> touch .editorconfig

> touch .eslintrc.json

> touch index.js

> npm instal --save-dev nodemon eslint eslint-config-prettier eslint-plugin-prettier prettier

> npm run dev

> npm start

## Instalación de Express.js y tu primer servidor HTTP

> npm install express

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

## Routing con Express.js

```js
app.get("/nueva-ruta", (req, res) => {
  res.send("Hola soy una nueva ruta");
});

app.get("/products", (req, res) => {
  res.json({
    name: "Product 1",
    price: 100,
  });
});
```

# CRUD

## ¿Qué es una RESTful API?

REST = Representational State Transfer

Es una convención para hacer servicio web que se comunican por el protocolo HTTP, el protocolo tiene varios verbos que definen como nosotros queremos modificar y operar cierta información. Y los verbos que solemos utilizar son GET, PUT, POST y DELETE.

Por cada entidad "relevante" que tengamos para nuestro proyecto vamos a tener una ruta (endpoint) por ejemplo /products.

GET -> /products -> Get list of products
GET -> /products/{id} -> Get the product with id
PUT -> /products -> Replace all (Dangerous, should not use)
PUT -> /products/{id} -> Update / Replace product with id
PATCH -> /products -> No Apply
PATCH -> /products/{id} -> Update
POST -> /products -> Create
POST -> /products/{id} -> No Apply
DELETE -> /products -> Delete all (Dangerous, dont...)
DELETE -> /products/{id} -> Delete product with id

Esta sería la convención que utilizaríamos para hacer un CRUD

## GET: recibir parámetros

api.example.com/tasks/{id}/
api.example.com/people/{id}/
api.example.com/users/{id}/tasks/

Los endpoints son en plural

```js
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    name: "Product 1",
    price: 100,
  });
});

app.get("/categories/:categoryId/products/:productId", (req, res) => {
  const { categoryId, productId } = req.params;
  res.json({
    categoryId,
    productId,
  });
});
```

## GET: parámetros query

api.example.com/products
api.example.com/products?page=1
api.example.com/products?limit=10&offset=0
api.example.com/products?region=USA
api.example.com/products?region=USA&brand=XYZ

```js
app.get("/users", (req, res) => {
  const { limit, offset } = req.query;
  if (limit && offset) {
    res.json({ limit, offset });
  } else {
    res.send("No hay parametros");
  }
});
```

> npm install faker

```js
app.get("/products", (req, res) => {
  const products = [];
  const { size } = req.query;
  const limit = size || 10;
  for (let i = 0; i < limit; i++) {
    products.push({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl(),
    });
  }
  res.json(products);
});
```

## Separación de responsabilidades con express.Router

Se puede crear una carpeta routes y un archivo products.js

> mkdir routes

> touch routes/products.js

```js
const express = require("express");
const faker = require("faker");

const router = express.Router();

router.get("/products", (req, res) => {
  const products = [];
  const { size } = req.query;
  const limit = size || 10;
  for (let i = 0; i < limit; i++) {
    products.push({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price(), 10),
      image: faker.image.imageUrl(),
    });
  }
  res.json(products);
});

router.get("/products/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    name: "Product 1",
    price: 100,
  });
});

module.exports = { router };
```

> touch routes/index.js

```js
const { router: producsRouter } = require("./products");

function routerApi(app) {
  app.use("/products", producsRouter);
}

module.exports = { routerApi };
```

O para versionar la api podemos

```js
const express = require("express");

const { productsRouter } = require("./products");
const { categoriesRouter } = require("./categories");
const { usersRouter } = require("./users");

function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/products", productsRouter);
  router.use("/categories", categoriesRouter);
  router.use("/users", usersRouter);
}

module.exports = { routerApi };
```

## Instalación de Postman o Insomnia

Para descargar insomnia

https://insomnia.rest/download

Para instalar postman

https://www.postman.com/downloads/

o desde linux

> sudo apt install postman

> sudo packman -S postman

> sudo yum install postman

## POST: Método para crear

```js
router.post("/", (req, res) => {
  const body = req.body;
  res.json({
    message: "Created",
    data: body,
  });
});
```

Necesitamos agregar este middleware

```js
app.use(express.json());
```

## PUT, PATCH y DELETE

Con PUT deberíamos enviar todos los campos

Con PATCH podríamos enviar solo ciertos campos (los que queremos actualizar)

El deberíamos es por convención, lo podemos implementar de forma diferente pero estaríamos rompiendo con la convención lo cual puede traer confunsión a futuro.

```js
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  res.json({
    message: "Updated",
    data: body,
    id,
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: "Deleted",
    id,
  });
});
```

## Código de estado o HTTP response status codes

Los códigos de estado funcionan por rangos.

1. Informational responses (100 - 199)
2. Successful responses (200 - 299)
3. Redirects (300 - 399)
4. Client errors (400 - 499)
5. Server errors (500 - 599)

https://developer.mozilla.org/en-US/docs/Web/HTTP

https://http.cat/

```js
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (id === "999") {
    res.status(404).json({
      message: "Not found",
    });
  } else {
    res.status(200).json({
      id,
      name: faker.commerce.productName(),
      price: 100,
    });
  }
});

router.post("/", (req, res) => {
  const body = req.body;
  res.status(201).json({
    message: "Created",
    data: body,
  });
});
```

# Servicios

## Introducción a servicios: crea tu primer servicio

Donde ponemos toda la lógica del negocio, allí entran los servicios.

**The Clean Architecture**

- Entities (Centro): Aquí encontramos las entidades básicas de nuestro negocio. Ejemplo: Productos, Categorias, Ordenes de compra, etc.
- Use Cases (2da capa): Todo lo relacionado a la lógica de negocios. Los servicios van en esta capa.
- Controllers, Gateways, Presenters: Brindan acceso, serían los routers y middlewares.
- Devices, Web, UI, External Interfaces, DB: Serían ya otras aplicaciones.

Controllers (Routes, Middlewares) <-> Services <-> Libs(Models) <-> External sources (APIs, DBs)

> mkdir services

> touch services/product.service.js

```js
const faker = require("faker");

class ProductsService {
  constructor() {
    this.products = [];
    this.generate();
  }

  generate() {
    for (let i = 0; i < 100; i++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
      });
    }
  }

  create(data) {
    const product = {
      id: faker.datatype.uuid(),
      ...data,
    };
    this.products.push(product);
    return product;
  }

  find(limit, offset = 0) {
    if (!limit) return this.products;
    limit + offset > this.products.length
      ? (limit = this.products.length)
      : (limit = limit + offset);
    const productsSubset = [];
    for (let i = offset; i < limit; i++) {
      productsSubset.push(this.products[i]);
    }
    return productsSubset;
  }

  findOne(id) {
    const product = this.products.find((p) => p.id === id);
    return product;
  }

  update(id, changes) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    this.products[index] = { ...this.products[index], ...changes };
    return this.products[index];
  }

  delete(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    this.products.splice(index, 1);
    return { id };
  }
}

module.exports = ProductsService;
```

## Async await y captura de errores

La gran mayoría de los servicios son asíncronos. Primero es una gran habilidad de node el correr servicios de forma asíncrona y segundo normalmente nos conectamos a una base de datos o servicios que se ejecutan de forma asíncrona

```js
find(limit, offset = 0) {
    if (!limit)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.products);
        }, 5000);
      });
    limit + offset > this.products.length
      ? (limit = this.products.length)
      : (limit = limit + offset);
    const productsSubset = [];
    for (let i = offset; i < limit; i++) {
      productsSubset.push(this.products[i]);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(productsSubset);
      }, 5000);
    });
  }

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit || 0, 10);
  const offset = parseInt(req.query.offset || 0, 10);
  const products = await service.find(limit, offset);
  res.status(200).json(products);
});

```

# Middlewares

## ¿Qué son los Middlewares?

Los middlewares están en medio del request y el response

Request -> Middleware -> Response

Los middlewares se pueden utilizar de forma global (para manejar los errores de nuestra aplicación)

Se pueden utilizar en ciertos endpoints (para manejar jwt)

Se pueden utilizar de forma secuencial (validar data -> validar permisos), un middleware puede bloquear el que la transacción siga.

La estructura lógica del middleware es (Los middlewares más cómunes)

```js
function (req, res, next) {
  if (something) {
    res.send('end');
  } else {
    next();
  }
}
```

La estructura de un middleware de tipo error

```js
function (error, req, res, next) {
  if (error) {
    res.status(500).json({ error });
  } else {
    next();
  }
}
```

**Use Cases**

- Funcionan como pipes, podemos conectar unos con otros.
- Validar datos
- Capturar erores
- Validar permisos
- Controlar accesos

## Middleware para HttpErrors

Un middleware global para capturar y formatear el error de forma adecuada para enviarlo a nuestro cliente. Creamos una carpeta llamada middlewares

> mkdir middlewares

> touch middlewares/error.handler.js

```js
function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

module.exports = {
  logErrors,
  errorHandler,
};
```

Los middleware de tipo error se deben definir después de colocar el routing, en el index.js

```js
const { logErrors, errorHandler } = require("./middleware/error.handler");

// estos van al final de todas las rutas y antes del app.listen
app.use(logErrors);
app.use(errorHandler);
```

Hay que llamar al middleware de error de forma explicita.

En products.service.js

```js
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await service.findOne(id);
    res.json(product);
  } catch (err) {
    next(err);
  }
});
```

## Manejo de errores con Boom

> npm install @hapi/boom

En products.service.js

```js
async findOne(id) {
  const product = this.products.find(item => item.id === id);
  if (!product) {
    throw boom.notFound("Product not found");
  }
}
async update(id, changes) {
  const index = this.products.findIndex(item => item.id === id);
  if (index === -1) {
    throw boom.notFound("Product not found");
  }
  const product = this.products[index];
  // resto del código
}
```

Para trabajar con boom hay que utilizar un error handler especial para boom

```js
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}
```

```js
const { logErrors, errorHandler } = require("./middleware/error.handler");

// estos van al final de todas las rutas y antes del app.listen
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
```

Esto es en el controlador para manejar en la lǵocia de negocio si algo está bloqueado.

```js
async findOne(id) {
  const product = this.products.find(item => item.id === id);
  if (!product) {
    throw boom.notFound("Product not found");
  }
  // Esto sería un producto que existe pero que por lógica de negocio está bloqueado
  if(product.isBlock) {
    throw boom.conflict('product is blocked');
  }

}
```

## Validación de datos con Joi

> npm install joi

Para ver la documentación

> npm docs joi

Joi es una librería muy poderosa para hacer validación de esquemas.

Primero creamos una carpeta para los schemas

> mkdir schemas

> touch schemas/product.schema.js

```js
const Joi = require("joi");

// Creamos un esquema específico para cada campo
const id = Joi.string().uuid();
const name = Joi.string().min(3).max(15);
const price = Joi.number().integer().min(10);
const image = Joi.string().uri();

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  image: image.required(),
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
});

const getProductSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema };
```

Ahora para empezar a validar podemos crear un middleware al cual enviarle nuestro esquema y con la validación de Joi ver si los datos cumplen con el esquema.

> touch middleware/validator.handler.js

```js
const boom = require("@hapi/boom");

// Necesitamos construir middlewares de forma dinámica.
function validatorHandler(schema, property) {
  // El eschema podría ser cualquiera de los que creamos
  // Esto sería un closure
  return (req, res, next) => {
    // La property puede ser:
    //  req.body
    //  req.params
    //  req.query
    //  o incluso podría ser otro
    const data = req[property];
    // const { error } = schema.validate(data);
    // El abortEarly = false es para que mande todos los errores que encuentre y no uno por uno
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      // bad request es 400
      // Para que lo procese el middleware de errores necesito llamar a next
      next(boom.badRequest(error));
    }
    // Si no hay error pues siempre necesito llamar a next
    next();
  };
}

module.exports = validatorHandler;
```

## Probando nuestros endpoints

Ahora para poder utilizarlo en nuestros endpoints debemos modificar el archivo de rutas (products.routes.js)

```js
// Importamos el validation handler
const validatorHandler = require("./../middlewares/validator.handler");
// Importamos los esquemas
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
} = require("./../schemas/product.schema");

router.get(
  "/:id",
  validatorHandler(getProductSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (err) {
      next(error);
    }
  }
);
```

Con esto si hago una solicitud de tipo GET a /api/v1/products/1 no va a ejecutar esa opearción porque el id no es un uuid.

```js
router.post(
  "/",
  validatorHandler(createProductSchema, "body"),
  async (req, res, next) => {
    // resto del post
  }
);

router.patch(
  "/:id",
  validatorHandler(getProductSchema, "params"),
  validatorHandler(updateProductSchema, "body"),
  async (req, res, next) => {
    // resto del patch
  }
);
```

## Middlewares populares en Express.js

A continuación una lista de los middlewares más populares en Express.

**CORS**

Middleware para habilitar CORS (Cross-origin resource sharing) en nuestra ruta o aplicación

https://expressjs.com/en/resources/middleware/cors.html

**Morgan**

Un logger de solicitudes HTTP para Node.js

https://expressjs.com/en/resources/middleware/morgan.html

**Helmet**

Helmet nos ayuda a proteger nuestras aplicaciones Express configurando varios encabezados HTTP. ¡No es a prueba de balas de plata, pero puede ayudar!

https://github.com/helmetjs/helmet

**Express Debug**

Nos permite hacer debugging de nuestras aplicaciones en express mediante el uso de un toolbar en la página cuando las estamos desarrollando

https://github.com/devoidfury/express-debug

**Express Slash**

Este middleware nos permite evitar preocuparnos por escribir las rutas con o sin slash al final de ellas

https://github.com/ericf/express-slash

**Passport**

Passport es un middleware que nos permite establecer diferentes estrategias de autenticación a nuestras aplicaciones

https://github.com/jaredhanson/passport

Más middleware populares aquí:

https://expressjs.com/en/resources/middleware.html

# Deployment

## Consideraciones para producción

**Recomendaciones**

- Cors
- Https
- Procesos de Build
- Remover logs
- Seguridad (Helmet)
- Testing

**CORS**

Los browsers tienen una protección por defecto para aceptar peticiones desde le mismo origen. Esto por ejemplo pasa desde el frontend intento acceder a un backend que está en diferente origen.

## Problemas de CORS

```js
const cors = require("cors");

const whitelist = ["http://localhost:8080", "https://myapp.co"];

const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("no permitido"));
    }
  },
};

app.use(cors(options));

//...
routerApi(app);
//.. resto de middlewares y app.listen
```

## Deployment a Heroku

> curl https://cli-assets.heroku.com/install.sh | sh

> heroku --version

> heroku login

> heroku create

Heroku create nos crea un nuevo remote

> git remote -v

En nuestro package.json debemos especificar la versión de node que queremos correr

```json
"engines": {
  "node": "14.x"
}
```

Podemos correrlo de forma local

> heroku local web

esto es en el index.js para aceptar peticiones del mismo origen (!origin)

```js
// Esto porque heroku tienen una variable de entorno con el puerto
const port = process.env.PORT || 3000;

const options = {
  origin: (origin, callback) => {
    // El !origin para aceptar peticiones del mismo origen
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("no permitido"));
    }
  },
};
```

Creamos un archivo Procfile

web es el comando para correr mi aplicación de forma explicita

```
web: npm run start
```

> git add .

> git commit -m "Added a procfile

> git checkout main

> git merge dev

> git push heroku main

> heroku logs
