# Base de Datos

## Configuración de Postgres en Docker

**Corriendo Postgres con Docker**

> touch docker-compose.yml

```yaml
version: "3.3"

services:
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=my_store
      - POSTGRES_USER=fredy
      - POSTGRES_PASSWORD=P@sw0rd
    ports:
      - 5432:5432
```

> docker-compose up -d postgres

> docker-compose ps

> docker-compose down postgres

Los contenedores son stateless, no tienen estado. Pero una base de datos necesita persistir información. Ua una base de datos deberíamos crearle un volumen.

```yaml
version: "3.3"

services:
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=my_store
      - POSTGRES_USER=fredy
      - POSTGRES_PASSWORD=P@sw0rd
    ports:
      - 5432:5432
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
```

Hay que agregar la carpeta postgres_data al gitignore para que no lo suba a nuestro repositorio.

> docker-compose up -d postgres

> docker-compose ps

## Explorando Postgres: Interfaces gráficas vs. Terminal

Para correr un bash en el contenedor

> docker-compose exec postgres bash

Dentro del contenedor para conectarnos a la base de datos:

> psql -h localhost -d my_store -U fredy

Para ver la estructura de la base de datos

> \d+

Para salirnos de la base de datos

> \q

Y para salirnos del contenedor

> exit

Si queremos una interfaz gráfica podemos utilizar pgAdmin y esto podemos correrla con Docker

```yaml
version: "3.3"

services:
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=my_store
      - POSTGRES_USER=fredy
      - POSTGRES_PASSWORD=P@ssw0rd
    ports:
      - 5432:5432
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environments:
      - PGADMIN_DEFAULT_EMAIL=admin@mail.com
      - PGADMIN_DEFAULT_PASSWORD=P@ssw0rd
    ports:
      - 5050:80
```

> docker-compose up -d pgadmin

Luego podemos ir a la url http://localhost:5050

> docker ps

Para ver la Ip del contenedor podemos ejecutar el comando:

> docker inspect id-del-contenedor

Y buscamos el campo IPAddress

```sql
CREATE TABLE tasks (
    id serial PRIMARY KEY,
    title VARCHAR (255)  NOT NULL,
    completed boolean DEFAULT false
);
```

## Integración de node-postgres

Vamos a utilizar el driver nativo que es node-postgres https://node-postgres.com

> npm install pg

En nuestro proyecto ya tenemos las capas de servicios, esquemas, routing, middlewares. Vamos a crear una nueva capa de librería. Las librerías se encargan de conexiones a terceros.

> mkdir libs

> touch libs/postgres.js

```js
const { Client } = require("pg");

async function getConnection() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "fredy",
    password: "P@ssw0rd",
    database: "my_store",
  });
  await client.connect();
  return client;
}

module.exports = getConnection;
```

Ahora ya lo podemos importar en nuestros servicios:

En los servicios tenemos: category.service.js, order.service.js, product.service.js, user.service.js

```js
const getConnection = require("./../libs/postgres");

class UserService {
  constructor() {}

  async find() {
    const client = await getConnection();
    const response = await client.query("SELECT * FROM tasks");
    return rta.rows;
  }
}
```

## Manejando un Pool de conexiones

El tipo de conexión anterior no es el más adecuado porque cada vez que llamamos a getConnection estamos creando una nueva conexión y eso no es una buena manera. node-postgress tiene una forma de manejar pools de conexiones. Y podemos utilizar la habilidad de pool del driver de pg en node.

**Pooling**

> touch libs/postgres.pool.js

```js
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "fredy",
  password: "P@ssw0rd",
  database: "my_store",
});

module.exports = pool;
```

Ahora, como se utiliza?

```js
const pool = require("./../libs/postgres.pool");

class ProductsService {
  constructor() {
    this.pool = pool;
    this.pool.on("error", (err) => console.log(err));
  }

  async find() {
    const query = "SELECT * FROM tasks";
    const response = await this.pool.query(query);
    return response.rows;
  }
}
```

## Variables de ambiente en Node.js

Es una muy mala practica el colocar las variables directamente en el código.

Creamos una carpeta config y un archivo config.js

> mkdir config

> touch config/config.js

```js
const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
};

module.exports = config;
```

Ahora en nuestro postgres.pool.js

```js
const { Pool } = require("pg");

const { config } = require("./../config/config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const pool = new Pool({
  connectionString: URI,
});

module.exports = pool;
```

Necesitamos crear un archivo .env

> touch ./.env

> touch ./.env.example

```
PORT=3000
DB_USER='fredy'
DB_PASSWORD='P@ssw0rd'
DB_HOST='localhost'
DB_NAME='my_store'
DB_PORT=5432
```

Necesitamos instalar .env

> npm install dotenv

Y ahora en nuestro archivo config.js

```js
// Agregamos esta línea
require("dotenv").config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
};

module.exports = config;
```

La línea require("dotenv").config() ejecuta una función que lee el archivo .env y carga las variables de entorno que esten definidas en el mismo.

# Squelize

## ¿Qué es un ORM? Instalación y configuración de Sequelize ORM

Es una capa que le agregamos a nuestra aplicación para conectarnos a nuestra base de datos y manejar todas las conexiones y operaciones a la base de datos con el paradigma orientado a objetos.

La idea es utilizar el mismo lenguaje de programación sin cambiar de contexto a sql.

Los dos orm más famosos en el entorno de node son Sequelize y TypeORM.

Instalamos sequelize

> npm install --save sequelize

Y también instalamos el driver de la base de datos

> npm install --save pg pg-hstore

Creamos un archivo en libs

> touch libs/sequelize.js

```js
const { Sequelize } = require("sequelize");

const { config } = require("./../config/config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// const sequelize = new Sequelize(URI, { dialect: "postgres", logging: true });
const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  logging: console.log,
});

module.exports = sequelize;
```

Entonces en el ProductService

```js
// En lugar del pool
// const pool = require("./../libs/postgres.pool");
const sequelize = require("./../libs/sequelize");

class ProductsService {
  constructor() {}

  async find() {
    const query = "SELECT * FROM tasks";
    // const [data, metadata] = await sequelize.query(query);
    // return { data, metadata };
    const [data] = await sequelize.query(query);
    return data;
  }
}
```

## Tu primer modelo en Sequelize

Estos son esquemas pero no como los esquemas que validamos con Joi, sino que son esquemas de la base de datos para sequelize. Creamos una carpeta db

> mkdir db

> mkdir db/models

> touch db/models/user.model.js

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const USER_TABLE = "users";

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  // Este sería el nombre que tiene en nuestro modelo
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    // Este sería el nombre que tiene en la base de datos
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
};

// Al extender del modelo entonces la clase tiene los métodos find, findAll, etc
class User extends Model {
  static associate() {
    // Aquí se definen las relaciones
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      //
      timestamps: false,
    };
  }
}

module.exports = { USER_TABLE, UserSchema, User };
```

Creamos un archivo index.js

> touch db/models/index.js

```js
const { User, UserSchema } = require("./user.model");

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
}

module.exports = setupModels;
```

Esto lo vamos a utilizar en libs/sequelize.js

```js
const { Sequelize } = require("sequelize");

const { config } = require("./../config/config");
const { setupModels } = require("./../db/models");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

// const sequelize = new Sequelize(URI, { dialect: "postgres", logging: true });
const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  logging: console.log,
});

// despues de crear la instancia de sequelize le pasamos los modelos
setupModels(sequelize);

// Esta es una sincronización para que lea los modelos
// que configuramos y los sincroniza... entonces creará las tablas

sequelize.sync();

module.exports = sequelize;
```

Y esto para hacer un select en el users.service

```js
// const sequelize = require("./../libs/sequelize");
const { models } = require("./../libs/sequelize");

class UsersService {
  constructor() {}

  async find() {
    // const query = "SELECT * FROM tasks";
    // const [data] = await sequelize.query(query);
    const data = await models.User.findAll();
    return data;
  }
}
```

productos, ordenes de compra, usuarios, clientes, categorías

## Crear, actualizar y elminar

En users.service

```js
// const sequelize = require("./../libs/sequelize");
const { models } = require("./../libs/sequelize");

class UsersService {
  constructor() {}

  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }

  async find() {
    // const query = "SELECT * FROM tasks";
    // const [data] = await sequelize.query(query);
    const data = await models.User.findAll();
    return data;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound("User not found");
    }
    return user;
  }

  async update(id, changes) {
    // const user = await models.User.findByPk(id);
    const user = await this.findOne(id);
    const data = await user.update(changes);
    return data;
  }

  async delete(id) {
    // const user = await models.User.findByPk(id);
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}
```

Hay que capturar los errores que vienen del ORM, por ejemplo si tratamos de crear un email repetido (no es una llave pero debe ser único). Entonces hay que crear un middleware para manejar el error.

En error.heandler.js

```js
const { ValidationError } = require("sequelize");
// Es un nuevo middleware de error
function ormErrorHander(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  }
  next(err);
}
```

Y este middleware hay que ponerlo en el index junto con los otros middlewares de error.

```js
//...

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.user(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

## Cambiando la base de datos a MySQL

En el docker-compose.yml

```yaml
version: "3.3"

services:
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=my_store
      - POSTGRES_USER=fredy
      - POSTGRES_PASSWORD=P@ssw0rd
    ports:
      - 5432:5432
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environments:
      - PGADMIN_DEFAULT_EMAIL=admin@mail.com
      - PGADMIN_DEFAULT_PASSWORD=P@ssw0rd
    ports:
      - 5050:80

  mysql:
    image: mysql:5
    environment:
      - MYSQL_DATABASE=my_store
      - MYSQL_USER=root
      - MYSQL_ROOT_PASSWORD=P@ssw0rd
      - MYSQL_PORT=3306
    ports:
      - 3306:3306
    volumes:
      - ./mysql_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      - MYSQL_ROOT_PASSWORD=P@ssw0rd
      - PMA_HOST=mysql
    ports:
      - 8080:80
```

Hay que agregar mysql_data al gitignore

> docker-compose up -d mysql

> docker-compose ps

> docker-compose up -d phpmyadmin

Necesitaríamos instalar en el proyecto los drivers para mysql

> npm install --save mysql2

En el archivo .env cambiamos el DB_PORT

```
PORT=3000
DB_USER='root'
DB_PASSWORD='P@ssw0rd'
DB_HOST='localhost'
DB_NAME='my_store'
DB_PORT=3306
```

Y en libs/sequelize.js cambiamos la conexión y el dialect

```js
const { Sequelize } = require("sequelize");

const { config } = require("./../config/config");
const { setupModels } = require("./../db/models");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
  dialect: "mysql",
  logging: console.log,
});

setupModels(sequelize);

sequelize.sync();

module.exports = sequelize;
```

# Migraciones

## ¿Qué son las migraciones? Migraciones en Sequelize ORM

**django**

Migrations are Django's way of **propagating changes** you make to your models (adding a field, deleting a model, etc.) into you database schema.

**Laravel**

Migrations are like **version control** for your database, allowing your team to define and share the application's database schema definition.

**Sequelize**

Just like you use **version control** systems such as Git to manage changes in your code, you can use migrations to keep track of changes to the database.

La migración de las tablas en este momento se hace con la función sync()

```js
sequelize.sync();
```

Sin embargo esto no se recomienda para producción.

Para poder correr migraciones al modo de producción vamos a utilizar el sequelize-cli

> npm install --save-dev sequelize-cli

Creamos un archivo llamado .sequelizerc

> touch .sequelizerc

```js
module.exports = {
  config: "./db/config.js",
  "model-path": "./db/models/",
  "migrations-path": "./db/migrations/",
  "seeders-path": "./db/seeders/",
};
```

> mkdir db/models

> mkdir db/migrations

> mkdir db/seeders

> touch db/config.js

```js
const { config } = require("./../config/config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

module.exports = {
  developments: {
    url: URI,
    dialect: "postgres",
  },
  production: {
    url: URL,
    dialect: "postgres",
  },
};
```

Esta sería la configuración inicial para empezar a correr migraciones.

## Configurando y corriendo migraciones con npm scripts

En sequelize debemos nosotros decirle como correr las migraciones. Para esto creamos unos scripts en el package.json

```json
{
  "scripts": {
    "migrations:generate": "sequelize-cli migration:generate --name"
  }
}
```

> npm run migrations:generate create-user

Sequelize no genera las migraciones por mí automáticamente, sino que genera un boilerplate de la base de datos..

Quitamos el

```js
sequelize.sync();
```

Del archivo sequelize.js

Y en el archivo de la migración que nos creó lo vamos modificando:

```js
"use strict";

const { UserSchema, USER_TABLE } = require("./../models/user.model");

module.exports = {
  // Up sería para hacer la migración
  up: async (queryInterface) => {
    await queryInterface.createTable(USER_TABLE, UserSchema);
  },

  // Down sería para deshacer la migración
  down: async (queryInterface) => {
    // await queryInterface.drop(USER_TABLE);
    await queryInterface.dropTable(USER_TABLE);
  },
};
```

Y para correr la migración creamos otro comando en el package.json

```json
{
  "scripts": {
    "migrations:run": "sequelize-cli db:migrate",
    "migrations:revert": "sequelize-cli db:migrate:undo",
    "migrations:delete": "sequelize-cli db:migrate:undo:all"
  }
}
```

run sería para correr las migraciones, revert para hacer un undo de las migraciones y delete borraría todas las tablas.

> npm run migrations:run

## Modificando una entidad

Esto sería para agregar un campo a un modelo o modificarlo. Esto no se puede hacer con sync, pues sync lee un modelo inicial y luego ya no lo modifica.

Para esto deberíamos modificar nuestro users.model

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const USER_TABLE = "users";

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  // Le agregamos una columna de rol
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: "customer",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
};

class User extends Model {
  static associate() {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      timestamps: false,
    };
  }
}

module.exports = { USER_TABLE, UserSchema, User };
```

¿Cómo le comunicamos a nuestra tabla que modificamos el modelo y debe cambiar la tabla, y además que debe hacerlo con un alter table?

Primero generamos el boilerplate

> npm run migrations:generate add-role

```js
"use strict";

const { UserSchema, USER_TABLE } = require("./../models/user.model");

module.exports = {
  // Up sería para hacer la migración
  up: async (queryInterface) => {
    await queryInterface.addColumn(USER_TABLE, "role", UserSchema);
  },

  // Down sería para deshacer la migración
  down: async (queryInterface) => {
    // await queryInterface.drop(USER_TABLE);
    await queryInterface.removeColumn(USER_TABLE, "role");
  },
};
```

También tengo que modificar los esquemas de validación de Joi.

> npm run migrations:run

sequelize-cli va a correr desde la última que corrio anteriormente. No vuelve a correr la misma migración.

# Relaciones

## Relaciones uno a uno

Sequelize tiene dos métodos para expresar relaciones 1-1

Si queremos que la relación quede en la entidad B

A -> HasOne -> B

Si queremos que la relación quede en la entidad A

A -> BelongsTo -> B

Y la relación sería:

User -> BelongsTo -> Customer

Primero habría que definir el schema de la tabla Customers:

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const { USER_TABLE } = require("./user.model");

const CUSTOMER_TABLE = "customers";

const CustomerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  lastName: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "last_name",
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
  // Esta es la relación
  userId: {
    field: "user_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: USER_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class Customer extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: "user" });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_TABLE,
      modelName: "Customer",
      timestamps: false,
    };
  }
}

module.exports = { Customer, CustomerSchema, CUSTOMER_TABLE };
```

Y estes sería el index.js de los modelos

```js
const { User, UserSchema } = require("./user.model");
const { Customer, CustomerSchema } = require("./customer.model");

function setupModels(sequelize) {
  // Primero sucede la inicialización
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));

  // Y despues sucede la asociación
  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
}

module.exports = setupModels;
```

Y habría que crear el Servicio y las rutas para customer.

Las validaciones son de Joi serían

```js
const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const lastName = Joi.string();
const phone = Joi.string();
const userId = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();

const getCustomerSchema = Joi.object({
  id: id.required(),
});

const createCustomerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  user: Joi.object({
    email: email.required(),
    password: password.required(),
  }),
});

const updateCustomerSchema = Joi.object({
  name,
  lastName,
  phone,
  userId,
});

module.exports = {
  getCustomerSchema,
  createCustomerSchema,
  updateCustomerSchema,
};
```

Tenemos que generar una migración para la tabla

> npm run migrations:generate create-customers

```js
"use strict";

const {
  CustomerSchema,
  CUSTOMER_TABLE,
} = require("./../models/customer.model");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(CUSTOMER_TABLE, CustomerSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(CUSTOMER_TABLE);
  },
};
```

> npm run migrations:run

Esto debería crearnos una nueva tabla Customer con una foreign key hacia la tabla de users

Este sería el servicio de customers:

```js
const boom = require("@hapi/boom");
const { models } = require("../libs/sequelize");

class CustomerService {
  constructor() {}

  async find() {
    const rta = await models.Customer.findAll();
    return rta;
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id);
    if (!user) {
      throw boom.notFound("customer not found");
    }
    return user;
  }

  async create(data) {
    const newCustomer = await models.Customer.create(data);
    return newCustomer;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { rta: true };
  }
}

module.exports = CustomerService;
```

## Resolviendo las relaciones uno a uno

Para que el user_id sea único en la base de datos generamos una nueva migración

```js
"use strict";
const { DataTypes } = require("sequelize");

const { CUSTOMER_TABLE } = require("./../models/customer.model");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.changeColumn(CUSTOMER_TABLE, "user_id", {
      field: "user_id",
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: true,
    });
  },

  down: async (queryInterface) => {
    // await queryInterface.dropTable(CUSTOMER_TABLE);
  },
};
```

Y este sería el servicio

```js
const boom = require("@hapi/boom");
const { models } = require("../libs/sequelize");

class CustomerService {
  constructor() {}

  async find() {
    const rta = await models.Customer.findAll({
      include: ["user"],
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id);
    if (!user) {
      throw boom.notFound("customer not found");
    }
    return user;
  }

  async create(data) {
    /* 
    Se puede hacer así

    const newUser = await models.User.create(data.user);
    const newCustomer = await models.Customer.create({
      ...data,
      userId: newUser.id,
    });
    */

    // O se puede hacer así:
    const newCustomer = await models.Customer.create(data, {
      include: ["user"],
    });
    return newCustomer;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { rta: true };
  }
}

module.exports = CustomerService;
```

Y el user.model también puede tener la relación hasto para que la relación sea en ambas vías

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const USER_TABLE = "users";

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: "customer",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "create_at",
    defaultValue: Sequelize.NOW,
  },
};

class User extends Model {
  static associate(models) {
    this.hasOne(models.Customer, {
      as: "customer",
      foreignKey: "userId",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      timestamps: false,
    };
  }
}

module.exports = { USER_TABLE, UserSchema, User };
```

## Relaciones uno a muchos

Categoria -> hasMany -> Productos

Pero un producto solo tiene una Categoría.

La relación va a quedar en Productos, pues la relación queda en la entidad débil que en este caso es Productos.

Creamos el modelo para categories

> touch db/models/category.model.js

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const CATEGORY_TABLE = "categories";

const CategorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
};

class Category extends Model {
  static associate(models) {
    this.hasMany(models.Product, {
      as: "products",
      foreignKey: "categoryId",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: "Category",
      timestamp: false,
    };
  }
}

module.exports = { Category, CategorySchema, CATEGORY_TABLE };
```

Creamos el modelo para products

> touch db/models/product.model.js

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const { CATEGORY_TABLE } = require("./category.model");

const PRODUCT_TABLE = "products";

const ProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
  categoryId: {
    field: "category_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CATEGORY_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class Product extends Model {
  static associate(models) {
    this.belongsTo(models.Category, { as: "category" });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: "Product",
      timestamps: false,
    };
  }
}

module.exports = { Product, ProductSchema, PRODUCT_TABLE };
```

Y ahora pues falta agregar los modelos al index.js

```js
const { User, UserSchema } = require("./user.model");
const { Customer, CustomerSchema } = require("./customer.model");
const { Category, CategorySchema } = require("./category.model");
const { Product, ProductSchema } = require("./product.model");

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));

  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
}

module.exports = setupModels;
```

Generamos una migración

> npm run migrations:generate products

```js
"use strict";

const {
  CategorySchema,
  CATEGORY_TABLE,
} = require("./../models/category.model");
const { ProductSchema, PRODUCT_TABLE } = require("./../models/product.model");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(CATEGORY_TABLE, CategorySchema);
    await queryInterface.createTable(PRODUCT_TABLE, ProductSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(CATEGORY_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
  },
};
```

> npm run migrations:run

## Resolviendo relaciones uno a muchos

Falta hacer la lógica del CategoryService:

Este sería el esqueleto del category service

```js
const boom = require("@hapi/boom");

class CategoryService {
  constructor() {}

  async create(data) {
    return data;
  }

  async find() {
    return [];
  }

  async findOne(id) {
    return { id };
  }

  async update(id, changes) {
    return { id, changes };
  }

  async delete(id) {
    return;
  }
}
```

```js
const boom = require("@hapi/boom");
const { models } = require("./../libs/sequelize");

class CategoryService {
  constructor() {}

  async create(data) {
    const newCategory = await models.Category.create(data);
    return newCategory;
  }

  async find() {
    const categories = await models.Category.findAll();
    return categories;
  }

  async findOne(id) {
    // esto devolvería solo del modelo Category
    // const category = await models.Category.findByPk(id);
    // Y esta incluiría la asociación de los productos al seleccionar una categoría especifica.
    const category = await models.Category.findByPk(id, {
      include: ["products"],
    });
    return category;
  }

  async update(id, changes) {
    return { id, changes };
  }

  async delete(id) {
    return;
  }
}
```

Y el de products service también:

```js
const boom = require("@hapi/boom");
const { models } = require("./../libs/sequelize");

class ProductService {
  constructor() {}

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    // Esto devuelve solo de productos
    // const products = await models.Product.findAll();
    // Esto devuelve de productos e incluye la categoria por la asociación que se hizo en el modelo
    const products = await models.Product.findAll({
      include: ["category"],
    });
    return products;
  }

  async findOne(id) {
    return { id };
  }

  async update(id, changes) {
    return { id, changes };
  }

  async delete(id) {
    return;
  }
}
```

Es necesario modificar el product.schema.js para las validaciones de Joi

```js
const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string().min(3).max(15);
const price = Joi.number().integer().min(10);
const description = Joi.string().min(10);
const image = Joi.string().uri();
const categoryId = Joi.number().integer();

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  description: description.required(),
  image: image.required(),
  categoryId: categoryId.required(),
});

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
  description: description,
  categoryId,
});

const getProductSchema = Joi.object({
  id: id.required(),
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema };
```

# Consultas

## Órdenes de compra

Nuestro caso de uso para relaciones muchos a muchos serán las ordenes de compra donde un producto puede aparecer en muchas ordenes. Y las ordenes pueden tener muchos productos.

Esto se hace con una regla en sequelize que es belongsToMany

Products <- belongsToMany -> Orders

Esto siempre se resuelve con una tabla intermedia. Una Join table.

Primero debemos crear nuestra tabla de la orden de compra:

order.model.js

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const { CUSTOMER_TABLE } = require("./customer.model");

const ORDER_TABLE = "orders";

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  customerId: {
    field: "customer_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
};

class Order extends Model {
  static associate(models) {
    // Una order pertenece a muchos clientes
    // Yo pienso normalmente en que un cliente puede tener muchas ordenes (hasMany) pero aquí parece que es belongsTo
    this.belongsTo(models.Customer, {
      as: "customer",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: "Order",
      timestamps: false,
    };
  }
  static config(sequelize) {}
}

module.exports = { Order, OrderSchema, ORDER_TABLE };
```

Y efectivamente como pensaba hay que hacer el belongsTo y el hasMany en la tabla cliente

```js
class Customer extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: "user" });
    // Este es el hasMany que yo pensaba
    this.hasMany(models.Order, {
      as: "orders",
      foreignKey: "customerId",
    });
  }
}
```

En el index de los models hay que agregar la nueva tabla

```js
const { User, UserSchema } = require("./user.model");
const { Customer, CustomerSchema } = require("./customer.model");
const { Category, CategorySchema } = require("./category.model");
const { Product, ProductSchema } = require("./product.model");
const { Order, OrderSchema } = require("./order.model");

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));

  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Order.associate(sequelize.models);
}

module.exports = setupModels;
```

Luego hay que genera la migración

> npm run migrations:generate order

```js
"use strict";

const { OrderSchema, ORDER_TABLE } = require("./../models/order.model");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(ORDER_TABLE, OrderSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(ORDER_TABLE);
  },
};
```

Y corremos la migración

> npm run migrations:run

Y luego si ya continuamos en el OrderService

```js
const boom = require("@hapi/boom");
const { model } = require("./../libs/sequelize");

class OrderService {
  constructor() {}

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async find() {
    return [];
  }

  async findOne(id) {
    // const order = await models.Order.findByPk(id, {
    //   include: ["customer"],
    // });

    // Las asociaciones funcionan de forma anidada y puedo ir más profundo detallando esta asociación
    // Esto traería la orden de compra -> el cliente -> el usuario
    const order = await models.Order.finByPk(id, {
      include: [
        {
          association: "customer",
          include: ["user"],
        },
      ],
    });
    return order;
  }

  async update(id, changes) {
    return { id, changes };
  }

  async delete(id) {
    return;
  }
}
```

Este sería el Schema de validación de Joi para las ordenes

```js
const Joi = require("joi");

const id = Joi.number().integer();
const customerId = Joi.number().integer();

const getOrderSchema = Joi.object({
  id: id.required(),
});

const createOrderSchema = Joi.object({
  customerId: customerId.required(),
});

module.exports = { getOrderSchema, createOrderSchema };
```

## Relaciones muchos a muchos

Como necesitamos una tabla ternaria para hacer relaciones muchos a muchos, entonces necesitamos crear otro modelo

order-product.model.js

```js
const { Model, DataTypes, Sequelize } = require("sequelize");

const { ORDER_TABLE } = require("./order.model");
const { PRODUCT_TABLE } = require("./product.model");

const ORDER_PRODUCT_TABLE = "orders_products";

const OrderProductSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
  amount: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  orderId: {
    field: "order_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ORDER_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  productId: {
    field: "product_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class OrderProduct extends Model {
  static associate(models) {
    //
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PRODUCT_TABLE,
      modelName: "OrderProduct",
      timestamps: false,
    };
  }
}

module.exports = { OrderProduct, OrderProductSchema, ORDER_PRODUCT_TABLE };
```

Generamos la migración

> npm run migrations:generate order-products

Y modificamos el template de la migración

```js
"use strict";

const {
  ORDER_PRODUCT_TABLE,
  OrderProductSchema,
} = require("./../models/order-product.model");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, OrderProductSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
  },
};
```

Y ejecutamos la migración

> npm run migrations:run

Y hay en el index.js de models hay que agregar el modelo al setup

```js
const { User, UserSchema } = require("./user.model");
const { Customer, CustomerSchema } = require("./customer.model");
const { Category, CategorySchema } = require("./category.model");
const { Product, ProductSchema } = require("./product.model");
const { Order, OrderSchema } = require("./order.model");
const { OrderProduct, OrderProductSchema } = require("./order-product.model");

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  // Este
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));

  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Order.associate(sequelize.models);
  // También va a tener asociaciónes pero ¿quíen va a tener la relación?
  // Si yo quiero que order resuelva los items a traves de OrderProducts entonces es desde Order donde se realiza la relación.
}

module.exports = setupModels;
```

Entonces modificamos el Order Model

```js
class Order extends Model {
  static associate(models) {
    this.belongsTo(models.Customer, {
      as: "customer",
    });
    // Agregando esta asociación a traves de la tabla ternaria OrderProduct
    this.belongsToMany(models.Product, {
      as: "items",
      through: models.OrderProduct,
      foreignKey: "orderId",
      otherKey: "productId",
    });
  }
}
```

Y con esto esta el código configurado listo para manipular relaciones muchos a muchos.

## Resolviendo relaciones muchos a muchos

Empezamos creando el schema de validación de Joi

```js
const Joi = require("joi");

const id = Joi.number().integer();
const customerId = Joi.number().integer();
const orderId = Joi.number().integer();
const productId = Joi.number().integer();
const amount = Joi.number().integer().min(1);

const getOrderSchema = Joi.object({
  id: id.required(),
});

const createOrderSchema = Joi.object({
  customerId: customerId.required(),
});

const addItemSchema = Joi.object({
  orderId: orderId.required(),
  productId: productId.required(),
  amount: amount.required(),
});

module.exports = { getOrderSchema, createOrderSchema, addItemSchema };
```

El endpoint para agregar items a la order sería /orders/add-item/ esto hay que trabajarlo en el route (orders.route.js)

```js
const express = require("express");

const OrderService = require("../services/order.service");
const validatorHandler = require("../middlewares/validator.handler");
const {
  getOrderSchema,
  createOrderSchema,
  addItemSchema,
} = require("../schemas/order.schema");

const router = express.Router();
const service = new OrderService();

router.get(
  "/:id",
  validatorHandler(getOrderSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validatorHandler(createOrderSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newOrder = await service.create(body);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add-item",
  validatorHandler(addItemSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newItem = await service.addItem(body);
      res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
```

Y también hay que trabajar en el servicio de orders (orders.service.js)

```js
const boom = require("@hapi/boom");

const { models } = require("./../libs/sequelize");

class OrderService {
  constructor() {}

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async find() {
    return [];
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: "customer",
          include: ["user"],
        },
        "items",
      ],
    });
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }
}

module.exports = OrderService;
```

Se puede calcular un campo que sea un campo virtual como podemos ver en el código de total... este es un campo virtual, así que Sequelize sabe que ese campo no va en la base de datos sino que se calcula en runtime.

```js
total: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.items.length > 0) {
        return this.items.reduce((total, item) => {
          return total + item.price * item.OrderProduct.amount;
        }, 0);
      }
      return 0;
    },
  },
```

Y el mismo campo virtual en el order.model.js

```js
const { Model, DataTypes, Sequelize } = require("sequelize");
const { CUSTOMER_TABLE } = require("./customer.model");

const ORDER_TABLE = "orders";

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  customerId: {
    field: "customer_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW,
  },
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.items.length > 0) {
        return this.items.reduce((total, item) => {
          return total + item.price * item.OrderProduct.amount;
        }, 0);
      }
      return 0;
    },
  },
};

class Order extends Model {
  static associate(models) {
    this.belongsTo(models.Customer, {
      as: "customer",
    });
    this.belongsToMany(models.Product, {
      as: "items",
      through: models.OrderProduct,
      foreignKey: "orderId",
      otherKey: "productId",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: "Order",
      timestamps: false,
    };
  }
}

module.exports = { Order, OrderSchema, ORDER_TABLE };
```

Este tipo de campos virtuales se puede hacer también con un consulta SQL y de esta forma se puede usar para cosas no muy pesadas. Si son muchos campos sería mejor dejarle el cálculo a la base de datos en lugar de a la aplicación

## Paginación

Veamos como funciona una páginación con los parámetros limit y offset

limit = 2

El limit es el número de elemento que quiero traer, quiero 10 elementos, 20, 50 elementos. Puede ser que en una aplicación quiera renderizar 5 elementos y en la página web 10 elementos.

offset = 0

Y el offset es como un apuntador, sería como un indicador de cuantos elementos quiero escapar.

La primera consulta podría ser con limit = 2 y offset = 0. La siguiente consulta sería limit = 2 y offset = 2, la siguiente página sería limit = 2 y offset = 4

Nativamente sequelize y la mayoría de bases de datos va a oportar los elementos offset y limit de forma nativa.

```js
class ProductService {
  async find() {
    const products = await models.Product.findAll({
      include: ["category"],
      offset: 0,
      limit: 10,
    });
    return products;
  }
}
```

Entonce para agregar el limit y offset empezamos trabajandolo en nuestro product.schema.js (que son los schema validators de Joi)

```js
const limit = Joi.number().integer();
const offset = Joi.number().integer();

const queryProductSchema = Joi.object({
  limit,
  offset,
});

module.exports = { queryProductSchema };
```

Luego nos vamos a el routing de productos products.route.js

```js
const { queryProductSchema } = require("./../schemas/product.schema");

router.get(
  "/",
  validatorHandler(queryProductSchema, "query"),
  async (req, res, next) => {
    try {
      const product = await service.find(req.query);
      res.json(products);
    } catch (err) {
      next(error);
    }
  }
);
```

Lo que deberíamos ver en el products.service es como hacer esto dinámico

```js
class ProductService {
  async find(query) {
    const options = {
      include: ["category"],
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const products = await models.Product.findAll(options);
    return products;
  }
}
```

## Filtrando precios con operadores

Si consultamos la documentación de Sequelize podemos encontrar consultas tipo where. Y resulta que nuestros metodos de findAll podemos darle una opción de where.

Sequelize también tiene operadores para hacer operaciones mayor que, menor qué, etcetera.

Para empezar a trabajar esto podemos agregar al queryProductSchema el precio por si el usuario quiere filtrar por un precio:

```js
const limit = Joi.number().integer();
const offset = Joi.number().integer();

const queryProductSchema = Joi.object({
  limit,
  offset,
  price,
});

module.exports = { queryProductSchema };
```

Y en el product.service.js

```js
class ProductService {
  async find(query) {
    const options = {
      include: ["category"],
      // dejamos este where vacío
      where: {},
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    // Y aquí obtengo el price y lo asigno al where para se agrege a la consulta y que quede dinámico.
    const { price } = query;
    if (price) {
      options.where.price = price;
    }

    const products = await models.Product.findAll(options);
    return products;
  }
}
```

Podemos tambien filtrar por un rango de precios utilizando query params como price_min y price_max

```js
const limit = Joi.number().integer();
const offset = Joi.number().integer();

const queryProductSchema = Joi.object({
  limit,
  offset,
  price,
  price_min,
  // Esto me permite que una validación sea dínamica
  // Es para que valide esto si me manda un price_min debe haber un price_max
  price_max: price_max.when("price_min", {
    is: Joi.number().integer().required(),
    then: Joi.required(),
  }),
});

module.exports = { queryProductSchema };
```

Pero estas consultas debemos hacerlas con los operadores en product.service.js

```js
const { Op } = require("sequelize");

class ProductService {
  async find(query) {
    const options = {
      include: ["category"],
      // dejamos este where vacío
      where: {},
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }

    // Y aquí obtengo el price y lo asigno al where para se agrege a la consulta y que quede dinámico.
    const { price } = query;
    if (price) {
      options.where.price = price;
    }

    const { price_min, price_max } = query;
    if (price_min && price_max) {
      options.where.price = {
        [Op.gte]: price_min,
        [Op.lte]: price_max,
      };
    }

    const products = await models.Product.findAll(options);
    return products;
  }
}
```

# Despliegue

## Deploy en Heroku

Hay que lanzar a producción y podemos tener una base de datos productiva en Heroku.

Esto sería para agregar un proyecto de heroku como remote a mi repositorio

> heroku git:remote -a nombre-de-mi-proyecto

> git remote -v

Y así creamos una base de datos en el plan hobby-dev

> heroku addons:create heroku-postgresql:hobby-dev

> heroku pg:info

Resulta que Heroku utiliza una variable de entorno llamada DATABASE_URL para conectarse a la base de datos entonces necesito agregar esa variable a nuestro archivo .env

```
PORT=3000
DATABASE_URL='postgres://fredy:P@ssw0rd@localhost:5432/my_store'
```

Entonces en lugar de armar la conexión con diferentes variables solo utilizo el dato que ya viene en la variable de entorno DATABASE_URL

En sequelize.js (Donde hacemos la conexión)

```js
const { Sequelize } = require("sequelize");

const { config } = require("./../config/config");

//const USER = encodeURIComponent(config.dbUser);
//const PASSWORD = encodeURIComponent(config.dbPassword);
//const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const options = {
  dialect: "postgres",
  logging: config.isProd ? false : console.log,
};

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}
const sequelize = new Sequelize(config.dbUrl, options);

setupModels(sequelize);

module.exports = sequelize;
```

Y también debemos correr migraciones y las migraciones también tienen su propio archiov de configuración. Este sería el config.js dentro de ./db

```js
const { config } = require("./../config/config");

module.exports = {
  development: {
    url: config.dbUrl,
    dialect: "postgres",
  },
  production: {
    url: config.dbUrl,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
```

Hago un commit

> git add .

> git commit -m "Apply dbUrl"

Creo una nueva rama

> git checkout -b production

Y hago un push de la nueva rama a la rama main del repo en heroku

> git push heroku production:main

La dependencia de sequelize-cli debe ser una dependencia de producción porque heroku solo instala las de prod.

En producción debemos correr las migraciones y en heroku lo hacemos así:

> heroku run npm run migrations:run

## Consideraciones al hacer migraciones

En este caso da un error la migración porque en las migraciones crea la tabla User con el rol porque el esquema tiene rol y lo intenta volver a crear en la siguiente migración...

Entonces podemos modificar la migración de create-user, esto pasandole un esquema sin rol

```js
"use strict";

const { USER_TABLE } = require("./../models/user.model");
const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(USER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "create_at",
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(USER_TABLE);
  },
};
```

La otra migración en que sucedio algo similiar fue la de customers que teníamos un userId y primero lo creamos como no unique y la siguiente migración lo coloca como unique = true

```js
"use strict";

const { CUSTOMER_TABLE } = require("./../models/customer.model");
const { USER_TABLE } = require("./../models/user.model");
const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(CUSTOMER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "last_name",
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      userId: {
        field: "user_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(CUSTOMER_TABLE);
  },
};
```

Y la otra migración que da error es la de order por el campo virtual que se calcula desde la consulta de node

```js
"use strict";

const { ORDER_TABLE } = require("./../models/order.model");
const { CUSTOMER_TABLE } = require("./../models/customer.model");
const { DataTypes, Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(ORDER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      customerId: {
        field: "customer_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: CUSTOMER_TABLE,
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(ORDER_TABLE);
  },
};
```

En producción ya se había realizado una migración... entonces necesitaríamos hacer un rollback para borrar todo y volver a correr las migraciones... Esto es muy peligroso porque se pueden perder datos pero si es la primera vez no importa

Borro todo:

> heroku run npm run migrations:delete

Corremos las migraciones

> heroku run npm run migrations:run

Me parece que en conclusión deberíamos mantener separadas nuestros modelos de las migraciones para que esto no de esta clase de problemas.

otra cosa es que si es el primer release, en realidad lo que deberíamos tener una sola migración inicial entonces lo otro que se podría hacer es crear una sola migración con toda la estructura inicial del proyecto.
