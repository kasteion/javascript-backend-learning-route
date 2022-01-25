# Microservicios con NodeJS y Event Driven Architecture con RabbitMQ

## Admin App Setup

> mkdir admin

> cd admin

> npm init -y

> npm install --save express cors

> npm install --save-dev @types/express @types/node nodemon typescript

> touch tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["ES5", "ES6", "DOM"],
    "target": "ES5",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

> mkdir src

> touch src/app.ts

```ts
import * as express from "express";
import * as cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      // React
      "http://localhost:3000",
      // Vue
      "http://localhost:8080",
      // Angular
      "http://localhost:4200",
    ],
  })
);

app.listen(8000, () => {
  console.log(`Listening on port 8000`);
});
```

> npm install -g typescript

> tsc -w

> nodemon src/app.js

Creamos unos scripts en el package.json

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "tsc:watch": "tsc -watch",
    "start": "nodemon src/app.js"
  }
}
```

## Connecting with MySQL using TypeORM

> npm install --save typeorm

> npm install --save reflect-metadata

> npm install --save-dev @types/node

> npm install --save mysql

> mkdir src/entities

> touch src/entities/product.ts

```ts
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column({ default: 0 })
  likes: number;
}
```

> touch ormconfig.json

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "yt_node_admin",
  "entities": ["src/entities/*.js"],
  "logging": true,
  "synchronize": true
}
```

Para crear la conexión a la base de datos cambiamos el app.ts

```ts
import * as express from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";

createConnection().then((db) => {
  const app = express();

  app.use(
    cors({
      origin: [
        // React
        "http://localhost:3000",
        // Vue
        "http://localhost:8080",
        // Angular
        "http://localhost:4200",
      ],
    })
  );

  app.listen(8000, () => {
    console.log(`Listening on port 8000`);
  });
});
```

Cambiar ormconfig.json el logging a false

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "yt_node_admin",
  "entities": ["src/entities/*.js"],
  "logging": false,
  "synchronize": true
}
```
