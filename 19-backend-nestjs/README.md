# Introducción a NestJS

## ¿Qué es NestJS?

NestJS es un framework con abstracciones en base a Node. Cuando creamos una aplicación en base a node (por ejemplo con express) puede ser muy sencillo y esa simplicidad puede jugarnos en contra conforme empezamos a escalar.

NestJS nos da patrones como:

- SOLID
- Typescript
- Pogramación Orientada a Objetos
- Programación Funcional
- Programación Reactiva

La arquitectura que nos brinda está basada en controllers, services, data model y data access.

## Crea tu primer proyecto con NestJS

> node --version
>
> npm i -g @nestjs/cli
>
> nest --version
>
> nest --help

En VS Code

- ES Lint
- Prettier
- EditorConfig for VSCode

> nest new your-project-name
>
> cd your-project-name
>
> npm run start

## Estructura de aplicaciones en NestJS

**¿Qué hay dentro de una app?**

Trae configuraciónes en .eslintrc.js, .gitignore, .prettierrc.

nest-cli.json trae la forma en que va a leer el cli y como se ejecuta en nuestros proyectos.

Trae un README.md default.

Y Trae la configuración de typescript para que se transpile correctamente.

Un archivo que no viene por defecto es .editorconfig

.editorconfig

```
# ./editorconfig
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

El archivo main.ts es el que ejecuta nuestra aplicación. También tenemos un controlador (app.controller.ts), modulos y services.

## Presentación del proyecto: Platzi Store

Una API de un eCommerce... Ordenes de compra, Categorías, Usuarios, Clientes, Productos y Marcas.

## Repaso a TypeScript: tipos y POO

Creamos un archivo recap.ts

# REST API

## Introducción a controladores

Los controladores son los encargados de recibir los request de nuestra aplicación y tienen la responsabilidad de manipular los request, validar, ver que los tipos sean correctos, ver que los permisos de los usuarios sean correctos y si todo eso va bien entonces se conectan a los servicios para obtener los datos.

Los controladores son solicitudes que recibo desde cualquier cliente por medio del protocolo http y utilizamos los verbos http... GET, PUT, POST Y DELETE.

En nest vamos a tener decoradores. Los decoradores le indican a nest como se comporta una clase de typescript con respecto al framework por ejemplo:

```ts
import { Controller, Get } from "@nestjs/common";

// El decorador que indica que es un controller
@Controller()
export class AppController {
  constructor() {}

  // Indica que es una solicitud con el verbo Get http://localhost:3000/nuevo-endpoint
  // La ruta se puede definir como nuevo, /nuevo, /nuevo/ y va a resolver sin importar los slash
  @Get("nuevo-endpoint")
  getNewEndpoint(): string {
    return "Soy un nuevo endpoint";
  }
}
```

> npm run start:dev

## GET: recibir parámetros

Nosotros podemos tener varias rutas

api.example.com/tasks/{id}/
api.example.com/people/{id}/
api.example.com/users/{id}/

En nestjs tenemos el decorator @Param que se recibe como un atributo del método

```ts
import { Param } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("products/:productId")
  getProduct(@Param("productoId") productId: string) {
    return `product ${productId}`;
  }

  @Get("categories/:id/products/:productId")
  getCategory(@Param("productId") productId: string, @Param("id") id: string) {
    return `product ${productId} and ${id}`;
  }
}
```

## GET: parámetros query

También existen los parametros tipo query, que se utilizan para no enviar un conjunto de grandes parametros dentro de un endpoint.

Limit y offset sería como para cuando queremos que nuestro api devuelva resultados paginados.

```ts
import { Query } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("products")
  // getProducts(@Query() params: any)
  getProducts(
    @Query("limit") limit = 100,
    @Query("offset") offset = 0,
    @Query("brand") brand: string
  ) {
    return `products limit => ${limit} offset => ${offset}`;
  }
}
```

## Separación de responsabilidades

Single Responsibility, un método debería tener una sola responsabilidad. Nos lleva a escribir mejor código y métodos que sean más fáciles de testear.

Las clases también deberían tener una sola responsabilidad. Esto se puede aplicar a los controladores. Un controlador no debería atender a todos los endpoints sino un contralador para products, uno para categories, uno para clients.

Para crear controladores puedes usar el generador de código de NestJS con el siguiente comando:

> nest g controller products

NestJS creará una carpeta products con su controlador y un archivo para hacer pruebas unitarias.

Pero puedo crearlo en una carpeta de controllers en donde colocaremos todos nuestros controllers.

> nest g controller controllers/products

Si le agregamos flat no creara subcarpetas

> nest g controller controllers/products --flat

Endpoints

- Orders, Users, Customers, Categories, Products, Brands

## POST: Método para crear

```typescript
import { Post, Body } from "@nestjs/common";

@Controller("products")
export class ProductsController {
  @Post()
  create(@Body() payload: any) {
    return {
      message: "Product created",
      payload,
    };
  }
}
```

## Métodos PUT y DELETE para editar y eliminar

```ts
import { Put, Delete } from "@nestjs/common";

@Controller("products")
export class ProductController {
  @Put(":id")
  update(@Param("id") id: number, @Body() payload: any) {
    return {
      id,
      payload,
    };
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return { id };
  }
}
```

## Códigos de estado o HTTP responses status codes

Es un standard para cada uno de estos verbos http.

https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

```ts
import { HttpStatus, HttpCode, Res } from "@nestjs/common";

@Controller('products')
export class ProductsController {
  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED) // Decorador de código de estado, ACCEPTED es un 202
  getOne(
    @Res() response: Response,
    @Param('productId') productId: string
  ) {
    response.status(200).send({...}) // Con express directamente, no es muy útil así pues deberíamos dejar que el framework trabaje como mejor sabe pero se puede
    // El Request y el response se puede leer directamente
  }
}
```

# Integridad de datos

## Introducción a servicios: crea tu primer servicio

Los servicios son parte importante de NestJS. Los controladores se conectan a los servicios, los servicios manipulan esta data y se pueden conectar a los data modules y data access.

Los servicios van a tener el decorador @Injectable(). Esto significa que vamos a utilizar injección de dependencias.

> nest g s services/products --flat

Crea una carpeta services y los servicios y las clases para test. En el App modules se agregan los controllers y los servicios se agregan en providers.

En app.modules está el listado de controllers, servicios y eso.

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
  private products = [
    {
      id: 1,
      name: "Proudct 1",
      description: "Really cool product",
      price: 122,
    },
  ];
}
```

Creamos una carpeta llamada entities y dentro una entidad product.entity.ts

```ts
export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: numbers;
  image: string;
}
```

Segimos en el service

```ts
import { Injectable } from "@nestjs/common";
import { Product } from "../entities/product.entity";

@Injectable()
export class ProductsService {
  // products es un arreglo de Product

  private counterId = 1;

  private products: Product[] = [
    {
      id: 1,
      name: "Proudct 1",
      description: "Really cool product",
      price: 122,
      image: "",
      stock: 12,
    },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find((p) => p.id === id);
  }

  create(payload: any) {
    this.counterId += 1;
    const newProduct = {
      id: this.counterId,
      ...payload,
    };
    this.products.push(newProduct);
    return newProduct;
  }
}
```

Métodos update y delete.

## Implementando servicios en tu controlador

Ya vimos como crear nuestro primer servicio pero como esto se implementan en nuestro controladores se hace utilizando el motor de injección de dependencias. El servicio de products queremos utilizarlo en nuestro controlador de products.

```ts
// 1. Importamos el servicio
import { ProductsService } from "./../services/products.service";

@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsServices) {}

  @Get()
  getProducts() {
    return this.productsService.findAll();
  }

  @Get(":productsId")
  getOne() {
    this.productsService.findOne(+productId);
  }

  @Post()
  create() {
    return this.productsService.create(payload);
  }

  @Put(":id")
  update() {
    return this.productsService.update(+id, payload);
    // { ...product, ...payload } // Para que haga merge del product y el payload
  }
}
```

## Manejo de errores con throw y NotFoundException

Vamos a manejar los errores de forma dínamica. Digamos un get hacia un producto que no existe y que devuelve un status 200 es en realidad un falso positivo porque no lo encontró.

Esto se trabaja desde el products.service.ts

```ts
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class ProductsService {
  findOne(id: number) {
    const product = this.products.find((item) => item.id === id);
    // Error first
    if (!product) {
      // Si solo de doy un throw "Error"... lanza un error 500
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }
}
```

Otra forma podría ser con HttpException y HttpStatus

```ts
import { HttpException, HttpStatus } from '@nestjs/common';

// DENTRO DE TU SERVICIO O CONTROLLER
getProducts(){
    throw new HttpException('Error no se encontro', HttpStatus.BAD_REQUEST);
}
```

## Introducción a pipes: usa tu primer pipe

Un artefacto clave dentro de NestJS son los pipes, los pipes tienen dos formas o dos principales usos que son transformar y validar información. Tienen una forma muy interesante de acutar y es que la salida de un pipe puede ser la entrada de otro. Así podemos tener toda una tubería de pipes transformando y validando información.

Esto es en src/controllers/products.controller.ts

```ts
// NestJS viene con varios pipes ya implementados.
import { ParseIntPipe } from "@nestjs/common";

@Get(":id")
get(@Param("id", ParseIntPipe) id: number) {
  return this.productsService.findOne(id);
}
```

https://docs.nestjs.com/pipes#built-in-pipes

## Crea tu propio pipe (CustomPipes)

En la carpeta common o podría ser una carpeta shared

> nest g pipe common/parse-int

El pipe lo crearía en src/common/parse-int.pipe.ts con el código:

```ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw BadRequestException(`${value} is not a number`);
    }
    return val;
  }
}
```

Si lo queremos utilizar en src/controllers/products.controller.ts

```ts
// NestJS viene con varios pipes ya implementados.
import { ParseIntPipe } from "@nestjs/common";

@Get(":id")
get(@Param("id", ParseIntPipe) id: number) {
  return this.productsService.findOne(id);
}
```

## Data Transfer Objects

Para validar grupos de datos como los que vienen en un payload (por ejemplo del body en un patch o put).

Creamos una carpeta llamada dtos

Y dentro dtos/products.dto.ts

```ts
export class CreateProductDto {
  // El readonly es de typescript
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stock: number;
  readonly image: string;
}

// El updateProductDto tiene ? cuando declaro la variable pues los atributos son opcionales no tengo que enviarlos neceariamente.
export class UpdateProductDto {
  readonly name?: string;
  readonly description?: string;
  readonly price?: number;
  readonly stock?: number;
  readonly image?: string;
}
```

Y en el products.controller.ts

```ts
import { CreateProductDto, UpdateProductDto } from "./../dtos/products.dtos";

export class ProductsController {
  @Post()
  create(@Body() payload: CreateProductDto) {
    //...
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() payload: UpdateProductDto) {
    //...
  }
}
```

Pero no solo debe estar en el body en el controller sino que también en el service

```ts
// src/services/products.service.ts
export class ProductsService {
  create(payload: CreateProductDto) { // 👈 Dto
    ...
  }

  update(id: number, payload: UpdateProductDto) { // 👈 Dto
    ...
  }

}
```

Este tipado es ayuda a mejorar la experiencia de desarrollo.

## Validando parámetros con class-validator y mapped-types

La validación con los Dtos también se puede extender a la experiencia de usuario. Para esto se pueden instalar un par de dependencias

> npm install --save class-validator class-transformer

En el products.dtos.ts

```ts
import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  readonly image: string;
}
```

Para activar estas validaciones es necesario en el src/main.ts

```ts
import { ValidationPipe } from "@nestjs/common";

// Para activarlo de forma global
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Esta linea se agrega para agregar las validaciones de forma global
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
```

Esto hace que al momento de mandar mal los tipos en el body devuelva un error 400 (Bad Request) y con el listado de mensajes de si que tipo deben ser las cosas.

Class-Validator

https://github.com/typestack/class-validator

Para reutilizar el código de la validación de Dtos en el UpdateProductDto necesitaría instalar otra dependencia

> npm install --save @nestjs/mapped-types

Y el el products.dtos.ts

```ts
import { PartialType } from "@nestjs/mapped-types";

// En lugar de todas las definiciones de UpdateProductDto lo definimos así

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// Entonces UpdateProductDto heredaría todas las validaciones de CreateProductDto pero dejando todos los campos como opcionales.
```

## Evitando parámetros incorrectos

Con el ValidationPipe podemos restringir y curar nuestra data de que nos envíen datos incorrectos o maliciosos.

En el src/main.ts

```ts
app.useGlobalPipes(
  new ValidationPipe({
    // whitelist: true hace que automáticamente va a quitar del payload todos los atributos que no estén definidos dentro del dto (Los elimina ignorandolos pero sigue pasando el request pero sin los datos)
    whitelist: true,
    // forbidNonWhitelisted: true hace que que si me estan mandando una propiedad que no es entonces si da un error, no lo deja pasar esto puede no ser neceario porque el parametro anterior ya me quita los datos que no quiero.
    forbidNonWhitelisted: true,
  })
);
```

# Próximos pasos

## Reto: controladores y servicios restantes

Crear los controladores, DTOs y servicios para

- Products
- Categories
- Brands
- Users
- Customers

# Test

1. ¿Cuál es la forma correcta de tipar en TS?
   const name: string;
2.

Si defino una ruta con slashes, ejemplo = @Get('/ruta/'), puedo hacer peticiones con o sin el slash (/) al final.
Esta afirmación es:
Verdadera 3.
¿Cuál es el decorador para recibir parámetros de una solicitud GET?

@Param 4.
¿Cuál es la forma correcta para obtener un atributo de un parámetro de tipo consulta?
@Query('limit') 5.
¿Cuál de estas afirmaciones podría definir el principio de una sola responsabilidad?
Cada clase/método debe tener una única responsabilidad. 6.
¿Cuál es el decorador para recibir los parámetros del body dentro de una solicitud POST?
@Body() 7.
¿Cuál de estas afirmaciones describe la funcionalidad de un controlador?
Manejar las peticiones entrantes y retornar la respuesta al cliente. 8.
¿Cuál es el decorador que deben tener los servicios?
@Injectable() 9.
¿Cuál de estas afirmaciones describe la funcionalidad de un pipe?
Validar y transformar parámetros. 10.
¿Cuál de los siguientes comandos nos permite crear un Pipe desde la terminal?
nest g pi common/parse-int 11.
¿Es una buena práctica que la entidad y el DTO sean uno mismo?
Falso 12.
¿Cuál es la forma correcta de activar los DTOs para toda la aplicación?
app.useGlobalPipes(new ValidationPipe()); 13.
¿Cuál de las siguientes afirmaciones describe correctamente el funcionamiento de whitelist dentro de las opciones de ValidationPipe?
Ignora los atributos que no estén definidos en el DTO. 14.
¿Cuál de las siguientes afirmaciones describe el funcionamiento de forbidNonWhitelisted dentro de las opciones de ValidationPipe?
Alerta de un error al cliente cuando se envía un atributo no definido en el DTO. 15.
¿Cuál es la forma correcta de inyectar un servicio en un controlador?
constructor(private productsService: ProductsService) {}
