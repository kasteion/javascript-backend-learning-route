# Módulos de NestJS

Programación con módulos para escalar y organizar mejor el código de la aplicación en nestjs, injección de dependencias, configuración y deployment en heroku.

> git clone https://github.com/platzi/nestjs-modular.git
>
> cd nestjs-modular
>
> npm install
>
> git remote -v
>
> git remote rm origin
>
> git remote add origin hptts://github.com/kasteion

## Overview del proyecto: PlatziStore

El proyecto tiene dos módulos ya creados en la rama 2-step

- src
  - common
  - products
    - controllers
    - dtos
    - entities
    - services
    - products.module.ts
  - users
    - controllers
    - dtos
    - entities
    - services
    - users.module.ts

## Encapsular lógica en módulos

En el curso de fundamentos se trabajo todo en un mismo app module y esto no es tan escalable. Lo que debemos hacer es dividir en pequeños módulos (pequeños dominios y encapsularlos en su propio módulo)

Por ejemplo, el dominio de usuarios (son roles, autentificación) y podemos ponerlo en el módulo de usuarios.

Por ejemplo, el dominio de productos (las marcas, categorías, los productos como tal) y van en su propio módulo de productos.

El objetivo es que cada módulo se encargue de una parte en específico, agrupando ciertas características pero que nos permita escalar pero también donde se encuentra la lógica de cada uno de ellos.

Cada módulo funciona como una isla, cada uno tiene sus propios controllers, servicios y expone los servicios hacia nuestra api. Otro módulo pues será igual pero para conectarlos entre ellos necesitamos sentencias especiales.

1. En el main.ts corre la aplicación
2. En el app.modules.ts tenemos el módulo principal AppModule

Un módulo tiene el decorator @Module con cuatro atributos: imports: [], controllers: [], providers: [], exports: []

Nuestro cli nos ayuda a generar módulos

**1. Nests generate module**

> nest g mo users
>
> nest g mo products

Esto crea la estructura básica de un módulo y nos agrega el modulo a los imports del AppModulo (Qué es el principal)

**2. Luego creamos carpetas**

- controllers
- dtos
- entities
- services

**3. Empezamos a mover archivos**

Empezamos a mover archivos, los servicios de productos a la carpeta services del módulo de productos y así con cada dto, entity, controller, etc.

Categories va a estar junto con productos.

**4. Tenemos que corregir nuestro app module principal**

```ts
// Quitar los imports innecesarios
@Module({
    imports: [UsersModule, ProductsModule],
    controllers: [AppController],
    providers: [AppService]
})
```

**5. Tenemos que cablear nuestro módulo**

Por ejemplo de productos:

```ts
import { Module } from "@nestjs/common";
import { ProductsController } from "./controllers/products.controller";
import { CategoriesController } from "./controllers/categories.controller";
import { ProductsServices } from "./services/products.service";

@Module({
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

> npm run start:dev

## Interacción entre módulos

Ahora tenemos dos módulos en especifico. Pero que pasaría si desde users necesito consumir el products services. Entonces en users creo una nueva entidad que representa las ordenes de compra.

order.entity.ts

```ts
import { User } from "./users.entity";
import { Product } from "./../../products/entities/product.entity";

export class Order {
    date: Date,
    user: User;
    products: Product[];
}
```

En el controller de users agregamos un get

```ts
@Get(':id/orders')
getOrders(@Param('id', ParseIntPite) id: number) {
    return usersService.getOrdersByUser(id) // Creamos este método en el servicio
}
```

```ts
import { Order } from "../entities/order.entity";
// Products service para consultar los products desde aquí
import { ProductsService } from "./../../products/services/products.service";

@Injectable()
export class UserService {
  // Dependency injection
  constructor(private productsService: ProductsService) {}

  getOrdersByUser(id: number): Order {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: this.productsService.findAll(),
    };
  }
}
```

Pero esto da un error... Users Module necesita products service y necesita injectarlo dentro de su module. Pero se puede configurar que ProductModule exponga el servicio a otros modules. Entonces en products.module.ts

```ts
@Module({
  controllers: [ProductsController, CategoriesController, BrandsController],
  provider: [ProductsService, BrandsService, CategoriesService],
  // El export es lo que debemos agregar para que lo puedan usar otros módulos...
  exports: [ProductsService],
})
export class ProductsModule {}
```

Y luego en users.module.ts

```ts
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [ProductsModule],
  controllers: [CustomersController, UsersController],
  providers: [CustomerService, UserService],
})
export class UsersModule {}
```

## Entendiendo la inyección de dependencias

La inyección de dependencias nos permite desacoplar las cosas permitiendo que un controlador por medio de su constructor injecte el servicio A o el servicio B.

NestJS utiliza Singleton para mantener una sola instancia de los servicios que le pasamos por inyección de dependencias.

El decorador @Injectable() le dice a nestjs que el servicio se puede injectar y que debe manejarlo como un singleton.

Entonces tenemos Controllers que pueden tener varios servicios injectados. Además los servicios son singleton para no tener muchas instancias del mismo servicio en memoria.

Pero debemos cuidar que no tengamos dependenicas circulares. (Que el servicio A dependa del servicio B y el servicio B dependa del servicio A).

## useValue y useClass

En NestJS existen tipos de providers. Nosotros hemos utilizado uno, el useClass.

**useClass**

Es el que utilizamos por defecto para indicarle a nuestro módulo que necesitamos un servicio que va a ser inyectado en otros lados.

Lo que hace Nest es que lo desacopla en un objeto con dos atributos (provide y useClass ) ejemplo:

```ts
import { Module } from "@nestjs/common";
import { ProductsService } from "...";

@Module({
  providers: [
    {
      provide: ProductsService,
      useClass: ProductsService,
    },
  ],
})
export class ProductsModule {}
```

Esta es la más común.

**useValue**

Esto es otro tipo de provider que no sería una clase en específico sino un valor. Podemos proveer una clase lo que proveemos o simplemente un valor.

Ejemplo: en src/app.module.ts

```ts
//...
// 1. Necesitamos conectar con algún servicio y pasar un API Key para ese servicio
const API_KEY = "123456789";
const API_KEY_PROD = "PROD123456789SA";

@Module({
    imports: [UsersModule, ProductsModule],
    controllers: [AppController],
    providers: [
        AppService,
        // Aquí usamos el use value
        {
            provide: 'API_KEY',
            useValue: process.env.NODE_ENV === "production" ? API_KEY_PROD : API_KEY,
        }
    ]
})
export class AppModule()
```

Y este tipo de Providers se utilizaría así:

Ejemplo: en app.service.ts

```ts
// Necesitamos Inject
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor(@Inject("API_KEY") private apiKey: string) {}
  getHello(): string {
    return `Hello World! ${this.apiKey}`;
  }
}
```

> NODE_ENV=production npm run start:dev

## useFactory

Es otro tipo de provider que podemos utilizar. Es una fabrica, es decir que nosotros podemos fabricar ese provider de forma asincrona y también recibir una inyección.

Ejemplo: en src/app.module.ts

```ts
//...
import { Module, HttpModule, HttpService } from "@nestjs/common"

const API_KEY = "123456789";
const API_KEY_PROD = "PROD123456789SA";

@Module({
    imports: [HttpModule, UsersModule, ProductsModule, DatabaseModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: 'API_KEY',
            useValue: process.env.NODE_ENV === "production" ? API_KEY_PROD : API_KEY,
        },
        // Aquí va el useFactory
        {
            provide: 'TASKS',
            useFactory: async (http: HttpService) => {
                const tasks = await http.get('https://jsonplaceholder.typicode.com/todos').toPromise();
                return taks.data;
            },
            inject: [HttpService],
        }
    ]
})
export class AppModule()
```

El HttpModule que trae Nest trae axios por detras.

Ahora en app.service.ts

```ts
// Necesitamos Inject
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor(
    @Inject("API_KEY") private apiKey: string,
    @Inject("TASKS") private tasks: any[]
  ) {}
  getHello(): string {
    console.log(tasks);
    return `Hello World! ${this.apiKey}`;
  }
}
```

Esto va a ser útil para mandar variables de entornos y para conexiones a bases de datos se puede utilizar useFactory... typeORM usa useValue. Aquí se hizo para conectarnos a una api pero esta bien para una conexión a una base de datos. Ahora el HttpModule podemos utilizarlo dentro de un servicio, para insertar algo a una base de datos y luego hacer una consulta a un servicio externo (Ejemplo, un post y conectarlo a un servicio de IA para ver si el comentario es positivo.)

## Global Module

Ya vimos los diferentes tipos de providers (useClass, useValue y useFactory). Ahora vamos a ver el Global Module...
Lo que metamos en el global module va estar instanciado para todas los otros modulos. Crea una instancia que podemos inyectar en los otros módulos.

Hay que tener delicadeza con esto pero es muy útil...Como lo hicimos anteriormente lo que utilicemos con useValue y useFactory en app.module solo lo podemos usar en app.service y app.controller.

Cuando queremos que todos los servicios tengan el provider, valor o conexión a su disposición utilizamos estos Global Module. Ejemplo:

1. Vamos a generar un modulo llamado database

> nest g mo database

Esto crea database.module.ts

```ts
import { Module, Global } from "@nestjs/common";

// Con esta señal NestJS sabe que estos providers son globales
@Global()
@Module({})
export class DatabaseModule() {}
```

Entonces aquí podría tener las API_KEYS o las conexiones a las bases de datos.

```ts
import { Module, Global } from "@nestjs/common";

// Con esta señal NestJS sabe que estos providers son globales
@Global()
@Module({
    providers: [
        {
            provide: 'API_KEY',
            useValue: process.env.NODE_ENV === "production" ? API_KEY_PROD : API_KEY,
        }
    ],
    exports: ['API_KEY']
})
export class DatabaseModule() {}
```

Así la inyección del API_KEY la va a poder utilizar tanto el app.service como el users.service

```ts
@Injectable()
export class UsersService {
  constructor(
    private productService: ProductsService,
    @Inject("API_KEY") private apiKey: string
  ) {}
}
```

No hay necesidad de importar un Global Module.

El global module se puede utilizar para esas variables que deben ser utilizadas en todos lados. Por ejemplo, esa API_KEY, esa conexión a la base de datos.

El error de inyecciones circulares también se puede dar entre módulos. Esto se puede solucionar de forma sencilla con un GlobalModule que tenga los dos service y que los servicios que utilizen esos servicios los agarren del módulo global.

# Configuración de entornos

## Módulo de configuración Config Module

El Config Module nos va a permitir trabajar con variables de ambiente y diferentes ambientes. Tenemos entornos de desarrollo, testing, producción. Y estas variables de entorno se pueden trabajar haciendo que nestjs les ponga un tipo y también las proteja.

Así como manejamos las variables de entorno con useValue no es muy mantenible. Pero nestjs tiene un módulo especial para configuraciones con nestjs.

> npm install --save @nestjs/config

Este paquete tiene por detras el paquete dotenv pero adaptado para trabajar con nest.

Luego creamos en la raiz un archivo .env

Los archivos `*.env` tenemos que ponerlos en el git ignore porque tienen información delicada que no puede quedar en el repositorio.

En el archivo .env

```
API_KEY=123
DATABASE_NAME=my_db
```

Luego para que Nest lea lo que tenemos dentro del app.module.ts:

```ts
import { Module, HttpModule, HttpService } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { DatabaseModule } from "./database/database.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        HttpModule,
        UserModule,
        ProductsModule,
        DatabaseModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ],
    {
        provide: 'API_KEY',
        useValue: process.env.NODE_ENV === "production"? API_KEY_PROD : API_KEY,
    },
    // Aquí va el useFactory
    {
        provide: 'TASKS',
        useFactory: async (http: HttpService) => {
            const tasks = await http.get('https:/jsonplaceholder.typicode.com/todos')toPromise();
            return taks.data;
        },
        inject: [HttpService],
    }
})
```

Entonces ahora en users.service.ts ya tenemos un servicio global solo hay que importarlo

```ts
import { ConfigService } from "@nestjs/common";

@Injectable()
export class UsersService {
  // En lugar del @Inject("API_KEY") private apiKey: string
  // Este servicio inyecta todas las variables de entorno en cambio de la otra forma lo estaría haciendo uno a uno.
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService
  ) {}

  // Solo para ver como funciona
  findAll() {
    const apiKey = this.configService.get("API_KEY");
    const dbName = this.configService.get("DATABASE_NAME");
    console.log(apiKey, dbName);
    return this.users;
  }
}
```

## Configuración por ambientes

Esto es para poder tener varios archivos .env de acuerdo al ambiente.

1. Creamos 2 archivos de environment más

**.stag.env**

```
DATABASE_NAME=my_db_stag
API_KEY=333
```

**.prod.env**

```
DATABASE_NAME=my_db_prod
API_KEY=999
```

2. Creamos un archivo que tendrá los archivo deacuerdo al ambiente.

**src/environments.ts**

```ts
export const environments = {
  dev: ".env",
  stag: ".stag.env",
  prod: ".prod.env",
};
```

3. Utilizamos el diccionario de environments en app.module.ts para que deacuerdo a las variables de ambiente se configure un archivo de environment.

**src/app.module.ts**

```ts
import { enviroments } from './enviroments'; // 👈

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env', // 👈
      isGlobal: true,
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

4. En el service puedo utilizar las keys del
   **src/app.service.ts**

```ts
import { ConfigService } from "@nestjs/config"; // 👈

@Injectable()
export class AppService {
  constructor(
    @Inject("TASKS") private tasks: any[],
    private config: ConfigService // 👈
  ) {}
  getHello(): string {
    const apiKey = this.config.get<string>("API_KEY"); // esto es para tipar el dato (le estoy diciendo que es un string) 👈
    const name = this.config.get("DATABASE_NAME"); // 👈
    return `Hello World! ${apiKey} ${name}`;
  }
}
```

Y esto se puede correr así:

> NODE_ENV=prod npm run start:dev
>
> NODE_ENV=stag npm run start:dev

## Tipado en config

Nos podemos ayudar de typescript para no cometer errores llamando a la variable de entorno incorrecta.

1. Creamos un archivo src/config.ts

Este archivo nos sirve para mapear variables de entorno hacia un objeto. Inculos puede ser útil para agrupar variables, por ejemplo las relacionadas con bases de datos.

```ts
// src/config.ts // 👈 new file
import { registerAs } from "@nestjs/config";

export default registerAs("config", () => {
  // 👈 export default
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    apiKey: process.env.API_KEY,
  };
});
```

2. Entonces ya tenemos 3 archivos de cofiguración, pero los archivos .env son variables largas de archivos.

// .env

```
DATABASE_NAME=my_db_prod
API_KEY=999
DATABASE_PORT=8091 // 👈
```

// .stag.env

```
DATABASE_NAME=my_db_stag
API_KEY=333
DATABASE_PORT=8091 // 👈
```

// .prod.env

```
DATABASE_NAME=my_db_prod
API_KEY=999
DATABASE_PORT=8091 // 👈
```

3. Entonces podemos usarla en el app.service

```ts
// src/app.service.ts
// Ya no utilizamos ConfigService sino ConfigType
import { ConfigType } from "@nestjs/config"; // 👈 Import ConfigType
// También importamos el archivo config
import config from "./config"; // 👈 config file

@Injectable()
export class AppService {
  constructor(
    @Inject("TASKS") private tasks: any[],
    // Aquí lo inyectamos
    @Inject(config.KEY) private configService: ConfigType<typeof config> // 👈
  ) {}
  getHello(): string {
    // Entonces ya en vez de hacer el get("API_KEY") puedo hacerlo con el tipo
    const apiKey = this.configService.apiKey; // 👈
    const name = this.configService.database.name; // 👈
    return `Hello World! ${apiKey} ${name}`;
  }
}
```

4. Pero esto da un error si no hago una configuración en el app.module

```ts
// src/app.module.ts
import config from './config'; // 👈

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config], // 👈
      isGlobal: true,
      }),
...
],
...
})
export class AppModule {}
```

## Validación de esquemas en .envs con Joi

Hacer tipado en las variables de ambiente nos puede ayudar a envitar errores en tiempo de desarrollo. Pero ¿Qué pasa si el error es en producción y en el ambiente de producción nos mandan las variables de ambiente incorrectas?

Podemos blindarnos y agregar una validación extra al momento de inyectar estas variables.

> npm install --save joi

Luego en nuestro app.module

app.module.ts

```ts
// Es buena práctica separar las librerías de terceros de las del proyecto
import * as Joi from 'joi';  // 👈

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      // Aquí le agregamos una validación de esquema.
      validationSchema: Joi.object({ // 👈
        // Aquí la API_KEY no debería ser un number porque estas son string.
        API_KEY: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

Esto esta bien porque puede ser que ya un DevOps no ponga todas las variables de ambiente o coloque un texto donde debe ir un numero.

# Documentación

## Integrando Swagger y PartialType con Open API

Normalmente la documentación la pensamos como algo tortuoso, un folder donde entregamos unos archivos y ya nos olvidamos. Pero en realidad la documentación es algo vivo. Y ¿Como le entregamos una buena documentación a las demás personas?

La especificación OpenAPI es una especificación para escribir buena documentación legible para todo lo que sean REST apis, y hay un módulo para hacer esto de forma automática.

> npm install --save @nestjs/swagger swagger-ui-express

En el archivo main.ts

```ts
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  //...
  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("PLATZI STORE")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  //...
  await app.listen(3000);
}
bootstrap();
```

Esto hace autodocumentación

> npm run start:dev

Vamos en el browser a la dirección http://localhost:3000/docs/ y aquí podemos encontrar toda nuestra documentación.
Pero los Dtos no aparecen con información pues los dtos quedan dificiles de leer para el.

Para activar esto tenemos que modificar el archivo nest-cli.json

Agregamos la opcion "compilerOptions"

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": ["@nestjs/swagger/plugin"]
  }
}
```

Y en los dtos nos vamos buscando los import de PartialType que venían de @nestjs/mapped-types por PartialType de @nestjs/swagger

```ts
// Así era
// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from "@nestjs/swagger";
```

Detenemos el servicio.

La documentación de swagger genera archivos estáticos

> rm -rf dist
>
> npm run start:dev

Y es importante que lo dto sean extensión .dto.ts y los entities .entity.ts

## Extendiendo la documentación

Swagger hace el trabajo de autodocumentar pero podemos agregar ciertos detalles para que sea más fácil de leer y este más completa la documentación.

Podemos documentar cada uno de los atributos en lo dtos utilizando ApiProperty

```ts
// src/products/dtos/products.dtos.ts

import { PartialType, ApiProperty } from "@nestjs/swagger";

import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
} from "class-validator";
import { PartialType, ApiProperty } from "@nestjs/swagger"; // 👈

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `product's name` }) // 👈
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty() // 👈
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty() // 👈
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty() // 👈
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty() // 👈
  readonly image: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

Otra cosa que podemos hacer es agrupar los endpoints porque swagger nos presentara una lista de endpoints. Eso lo hacemos desde los controladores importando el decorador ApiTags

```ts
// src/products/controllers/products.controller.ts
// ApiTags para agrupar y ApiOperation para agregar una descripción a cada operación
import { ApiTags, ApiOperation } from "@nestjs/swagger"; // 👈

@ApiTags("products") // 👈
@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  // Aquí le colocaríamos una descripción a get
  @ApiOperation({ summary: "List of products" }) // 👈
  getProducts(
    @Query("limit") limit = 100,
    @Query("offset") offset = 0,
    @Query("brand") brand: string
  ) {
    // return {
    //   message: `products limit=> ${limit} offset=> ${offset} brand=> ${brand}`,
    // };
    return this.productsService.findAll();
  }
}
```

```ts
// src/products/controllers/brands.controller.ts
import { ApiTags } from '@nestjs/swagger';


@ApiTags('brands') // 👈
@Controller('brands')
export class BrandsController {
  ...
}
```

# Deploy

## Configuración de Heroku

Tenemos que tener en cuenta la configuración de CORS. En este caso estamos haciendo una aplicación en NodeJS y es una protección para que no se pueda hacer peticiones de todo internet. Normalmente solo se pueden hacer peticiones desde el mismo servidor si queremos abrir nuestra API para hacer request desde fuera debemos habilitar CORS

Esto se hace desde el main.ts

```ts
// src/main.ts
async function bootstrap() {
  //...
  // antes del app.listen esto abre la api para todo internet pero se puede limitar para que solo cietas aplciaciones puedan llegar.
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
```

Como lo de nest es una aplicación de Node entonces vemos la documentación

https://devcenter.heroku.com/article/deploying-nodejs

1. En el package.json debemos especificar la aplicación de node que queremos

Al final del package.json

```json
"engines": {
  "node": "14.x"
}
```

2. Tenemos que crear un archivo Procfile en el que decimos que script tenemos que correr ejecutar la aplicación

//Procfile

```
web: npm run start:prod
```

El comando start:prod compila typescript a js y lo ejecuta directamente con node.

Y debemos especificar el puerto en una variable de entorno.

3. Para hacer deployment en Heroku debemos tener una cuenta y debemos instalar el Heroku CLI

> curl https://cli-assets.heroku.com/install.sh | sh

4. Luego dentro del proyect debemos correr los comandos

> heroku login
>
> heroku create

5. Podemos ejecutar una prueba local con:

> heroku local web

Para ver si corre bien el proyecto (da un error por el puerto en el env)

En los archivos .env

```
PORT=3000
```

Y en el main.ts cambiamos el listen por

```ts
await app.listen(process.env.PORT || 3000);
```

Si al correr el heroku local no nos da ningun error pues ya podemos hacer el deploy con más confianza.

> git remote -v

Lo que hacer heroku es agregar un repo remoto hacia heroku para que pueda hacer cambios al proyecto ejecutando un

> git push heroku master

## Deploy de NestJS en Heroku

Antes de lanzar verificamos con

> heroku local web

Heroku utiliza la rama master y lo que tengamos en la master es el deployment automatico.

1. Nos pasamos a la rama master

> git checkout master

2. Hacemos un merge con la rama principal

> git merge 14-step

3. Revisamos que repos remotos tenemos

> git remote -v

4. Hacemos un push de la rama master al repo de heroku

> git push heroku master

En la terminal nos muestra el proceso que heroku esta realizando para ejecutar este servicio.

5. Si nos da un error podemos ejecutar el comando heroku logs para ver los logs

> heroku logs --tail

Resulta que da un error porque los .env no se suben estan siendo ignorados y es que las variables de entorno deberían existir en heroku esas variables hay que crearlas

6. Las variables de entorno las podemos configura desde la web entrando al nombre que nos dio en la url (En la pestaña Settings y Config Vars)

O podemos ejecutarlo desde el CLI

> heroku config:set API_KEY=12345
>
> heroku config:set DATABASE_NAME=my_db
>
> heroku config:set DATABASE_PORT=8091

Es bueno correr los scripts de format en el local (no en procesos de CI)

> npm run format

Si el cambio lo hicimos desde la web debemos hacer un commit

> git add .
>
> git commit -m "apply format"
>
> git push heroku master

Ahora si lo creamos desde la CLI entonces eso reinicia automaticamente el servicio.

- Cuidado con los typos
- No dejes comments en producción

# Próximos pasos

## Continúa con los cursos de persistencia de datos en NestJS

Los siguientes pasos serían conectar a bases de datos relacionales con TypeORM o a bases de datos no relacionales con Mongo

# Test

1.  ¿Es posible tener múltiples ambientes como por ejemplo dev, staging, QA production?
    Si es posible y deberíamos crear un archivo .env por cada uno de estos ambientes.
    CAMBIAR
2.  ¿Por qué es importante encapsular la lógica en módulos?
    Permite que cada módulo se encargue de un dominio en específico y, además, permite que la aplicación sea más fácil de mantener a futuro.

CAMBIAR 3.
¿Cuál es un buen uso de useValue dentro de NestJS?
Para inyectar valores que son constantes como arrays o strings
CAMBIAR 4.
¿Cuál decorador del paquete de @nestjs/swagger me permite agrupar los endpoints?
@ApiTags
CAMBIAR 5.
¿Cuál es un buen uso de useFactory dentro de NestJS?
Para inyectar valores que son asincrónicos y con dependencias
CAMBIAR 6.
¿Cuál propiedad se usa en un módulo para indicar que un servicio puede ser usando en otros módulos?
exports
CAMBIAR 7.
Si queremos recibir solicitudes desde cualquier origen ¿cuál es la forma indicada de configurarlo en NestJS?
app.enableCors();
CAMBIAR 8.
¿Cuál de las siguientes es una característica del Global Module?

Podemos usar los servicios en cualquier módulo sin necesidad de declararlo en los imports.
CAMBIAR 9.
¿Por qué es buena práctica validar las variables de entorno al arrancar la app?
Porque con ello nos aseguramos que contamos con las variables de entorno adecuadas para arrancar la app.
CAMBIAR 10.
¿Cuál es paquete que debemos instalar para manejar variables de entorno con archivos .env?
@nestjs/config
CAMBIAR 11.
¿Por qué es buena práctica tener tipado en las variables de entorno?
Porque podemos reducir el riesgo de tener errores de typo silenciosos que pueden llegar a producción.
CAMBIAR 12.
¿Cuál es el archivo correcto en donde hacemos la configuración del paquete @nestjs/swagger ?
main.ts
CAMBIAR 13.
¿Cuál de las siguientes afirmaciones describe mejor el patrón de Singleton?
Asegura que una clase solo cree una instancia una sola vez.
