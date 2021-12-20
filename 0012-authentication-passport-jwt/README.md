# Introducción

## Autenticación vs. Autorización

**Autenticación**

Se refiere a verificar quién es la persona. Se autentica con unas credenciales, se verifica con la base de datos y se da acceso.

**Autorización**

Tiene que ver más con la gestión de permisos. Se protegen ciertos endpoints.

## Tienda en linea: instalación del proyecto

Sería el proyecto que se ha estado trabajando.

En insomnia se pueden crear ambientes para tener separadas las urls y así poder probar los endpoints de dev y producción

# Protección de contraseñas

## Middleware de verificación

Vamos a crear un middleware para hacer verificaciones. Los middlewares nos ayudan a hacer esta autenticación y autorización. Los middlewares serán validadores y si se cumplen ciertos parametros se pasa al siguiente middleware. Vamos a trabajar un middleware con la siguiente lógica

```js
// Esto sería como un api key
if (req.headers["api"] === "123") {
  next();
} else {
  next(boom.unauthorized());
}
```

Creamos el middleware de auth

> touch middlewares/auth.handler.js

```js
const boom = require("@hapi/boom");

function checkApiKey(req, res, next) {
  const apiKey = req.headers["api"];
  if (apiKey === "123") {
    next();
  } else {
    next(boom.unauthorized());
  }
}

module.exports = { checkApiKey };
```

Entonces para utlizar este middleware nos vamos a nuestro index.js

```js
const { checkApiKey } = require("./middlewares/auth.handler");

//...

app.get("/nueva-ruta", checkApiKey, (req, res) => {
  res.send("Hola soy una nueva ruta");
});
```

Ese 123 esta quemado... entonces mejor debemos dejarlo en las variables de ambiente, entonces en nuestro .env agregamos

```
API_KEY=789123
```

Esta variable de entorno la colocamos en nuestro archivo config/config.js

```js
require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  isProd: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
};

module.exports = { config };
```

Y regresamos a trabajar a nuestro middleware

```js
const boom = require("@hapi/boom");

const { config } = require("./../config/config");

function checkApiKey(req, res, next) {
  const apiKey = req.headers["api"];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

module.exports = { checkApiKey };
```

Para las variables de entorno no hay live reload, sino que hay que detener el servidor y volverlo a lanzar pues se injectan cuando de inicial el servicio.

## Hashing de contraseñas con bcryptjs

Se hace un hash del password para guardarlo en la base de datos pues no se puede guardar el password en texto plano... eso es muy peligroso.

Para esto instalacom bcrypt

> npm install bcrypt --save

El hashing funciona así:

```js
// Importamos la librearía
const bcrypt = require("bcrypt");

// Tenemos el password
const myPassword = "admin 123 .202";

// Creamos el hash, a bcrypt.hash se le pasa el password y cuantas vecer va a correr el algoritmo o cuantos saltos... algo asi
const hashPassword = async () => {
  const hash = await bcrypt.hash(myPassword, 10);
  return hash;
};

console.log(hashPassword());
```

Para verificar el password se haría de la siguiente manera

```js
// Importamos la librearía
const bcrypt = require("bcrypt");

// Tenemos el password
const myPassword = "admin 123 .202";

// Creamos el hash, a bcrypt.hash se le pasa el password y cuantas vecer va a correr el algoritmo o cuantos saltos... algo asi
const verifyPassword = async (hash) => {
  const isMatch = await bcrypt.compare(myPassword, hash);
  return isMatch;
};

console.log(verifyPassword("el-hash"));
```

## Implementando hashing para usuarios

Primero cambiamos el user.service

```js
const bcrypt = require("bcrypt");

class UserService {
  async create(data) {
    const { password } = data;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash,
    });
    delete newUser.dataValues.password;
    return newUser;
  }
}
```

También habría que hacer el cambio en el CustomerService

```js
const bcrypt = require("bcrypt");

class CustomerService {
  async create(data) {
    const hash = await bcrypt.hash(data.user.password, 10);
    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hash,
      },
    };
    const newCustomer = await models.Customer.create(newData, {
      include: ["user"],
    });
    delete newCustomer.dataVAlues.user.dataValues.password;
    return newCustomer;
  }
}
```

Esto tambien se puede hacer así en sequelize:

```js
static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false,
      hooks: {
        beforeCreate: async (user, options) => {
          const password = await bcrypt.hash(user.password, 10);
          user.password = password;
        },
      }
    };
  }
```

# Passport y JSON Web Tokens

## Implementando login con Passport.js

Vamos a implementar la estrategia de autenticación y empezar a trabajar con el login utilizando passportjs que nos permite generar varias estrategias. Nosotros podemos crear nuestro propio endpoint y recibir por post nuestras credenciales pero passport nos ofrece otras estrategias para autenticarnos con github, facebook, linkedin, twitter.

1. Instalamos el motor de passport e instalamos la estrategia passport-local que es la estragia más simple (username y password)

> npm install passport passport-local

2. Creamos unas carpetas y estrategias

> mkdir utils/auth

> touch utils/auth/index.js

> mkdir utils/auth/strategies

> touch utils/auth/strategies/local.strategy.js

3. Empezamos a trabajar en local.strategy.js

```js
// Importamos la estrategia de passport-local
const { Strategy } = require("passport-local");

// Creamos una nueva instancia de la estrategia
const LocalStrategy = new Strategy();

// Exportamos la estrategia
module.exports = LocalStrategy;
```

4. En nuestro utils/auth/index.js

```js
const passport = require("passport");

const { LocalStrategy } = require("./strategies/local.strategy");

passport.use(LocalStrategy);
```

5. En nuestro servicio de usuarios (user.service.js) debemos crear una función para buscar por mail (porque el username es el mail)

```js
class UserService {
  async findByEmail(email) {
    const user = await models.User.findOne({ where: { email } });
    return user;
  }
}
```

6. Ya está definida pero la estragia no hace nada aún... falta definir la lógica de negocio así que seguimos en local.strategy.js

```js
const { Strategy } = require("passport-local");

// Necesitamos boom para los errores
const boom = require("@hapi/boom");

// Necesitamos bcrypt para verificar el password
const bcrypt = require("bcrypt");

// Necesito mi servicio de usuarios y crear una instancia del servicio
const UserService = require("./../../../services/user.service");
const service = new UserService();

// Y aquí definimos la logica de negocio para la estrageia
// La estrategia recibe username, password y una función done para ejecutar si algo sale bien o mal (como next)
const LocalStrategy = new Strategy(async (username, password, done) => {
  try {
    // Busco el usuario
    const user = await service.findByEmail(email);

    if (!user) {
      // si no encuentra el usuario lanza un error
      done(boom.unauthorized(), false);
    }

    // Entonces comparo el password que me envia el usuario con el user.password que viene de la base de datos (Hash)
    const isMatch = await bcrypt.compare(password, user.password);

    // Si el password no coincide entonces lanzo un error
    if (!iMatch) {
      done(boom.unauthorized(), false);
    }

    // si todo esta bien ejectamos done con null y el usuario
    done(null, user);
  } catch (err) {
    // Si algo sale mal ejecuto el done con el error y el false es para indicar que no se logro hacer la validación
    done(err, false);
  }
});

module.exports = LocalStrategy;
```

7. Ahora es necesaria llevar la estragia a los routers

> touch routes/auth.router.js

```js
const express = require("express");

// No necesito importar esquemas de validación de Joi porque la strategy valida que venga username y password
// Tampoco necesito importar servicios porque la strategy tiene implementado el servicio

// Si queremos a passport
const passport = require("passport");

const router = express.Router();

// Tengo que pasar passport como middleware con la estrategia "local" y no voy a crear una sesión (porque va a ser por jwt)
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res, next) => {
    try {
      // passport lo que hace es que en req.user pone el usuario para que lo use el siguiente middleware
      res.json(req.user);
    } catch (err) {
      next(error);
    }
  }
);
```

8. Este router hay que agregarlo al index.js de la carpeta routesß

```js
const express = require("express");

const productsRouter = require("./products.router");
const categoriesRouter = require("./categories.router");
const usersRouter = require("./users.router");
const orderRouter = require("./orders.router");
const customersRouter = require("./customers.router");
const authRouter = require("./auth.router");

function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/products", productsRouter);
  router.use("/categories", categoriesRouter);
  router.use("/users", usersRouter);
  router.use("/orders", orderRouter);
  router.use("/customers", customersRouter);
  router.use("/auth", authRouter);
}

module.exports = routerApi;
```

9. En nuestro index.js del proyecto

```js
// Esto ya estaba
app.use(cors(options));

//Para que ejecute el archivo utils/auth/index.js donde le decimos a passport que utilize la local strategy
require("./utils/auth");
```

10. En la estrategia podemos acomodar como queremos recibir los campos

```js
const { Strategy } = require("passport-local");
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");

const UserService = require("./../../../services/user.service");
const service = new UserService();

// Aquí antes de nuestra función asyncrona podemos mandar unas opciones
const LocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (username, password, done) => {
    try {
      const user = await service.findByEmail(email);
      if (!user) {
        done(boom.unauthorized(), false);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!iMatch) {
        done(boom.unauthorized(), false);
      }

      delete user.dataValues.password;

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
);

module.exports = LocalStrategy;
```

Con ese cambio el request debo hacerlo mandando los campos email y password en lugar de username y password.

## ¿Qué es un JWT?

Ya que encriptamos el password hay que hacer el sistema de autenticación. Y esto lo haremos con JSON Web Tokens.

Los JWT son stateless (No hay necesidad de guardarlos en memoria o en base de datos - en el servidor) - El JWT es un token encriptado que contiene la información para identificar el usuario y sus permisos. Esto permite hacer sistemas distribuidos un poco más fácil.

La forma de autenticación con cookies y de sesiones esta muy soportado en el browser pero no tanto en aplicaciones móviles.

JWT es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir informacion de forma segura entre partes como un objeto JSON. Esta información se puede verificar y confiar porque está firmada digitalmente. Los JWT se pueden firmar usando una palabra secreta (con el algoritmo HMAC) o un par de claves públicas / privadas usando RSA o ECDSA.

En el JWT vamos a utilizar los claims como sub, name, iat, etc. Un JWT tiene tres partes:

Header: Nos dice el algoritmo de encriptación y el tipo.

Payload: La información que trae el token

Signature: La utilizamos para verificar el token. Se combina el Header y el Payload y se firman con una palabra clave. Solo el backend debe tener la palabra clave y los tokens se generan y se verifican con la misma palabra clave.

## Firmar y verificar tokens

1. Instalamos la librearía de jsonwebtoken

> npm install jsonwebtoken

2. Creamos un archivo token-sign.js

```js
const jwt = require("jsonwebtoken");

const secret = "my super secret key";

// sub: Es la forma en que vamos a identificar el usuario
// scope: Normalmente se utiliza para los permisos.
const payload = {
  sub: 1,
  role: "customer",
};

const signToken = (payload, secret) => {
  return jwt.sign(payload, secret);
};

const token = signToken(payload, secret);
console.log(token);
```

3. Creamos un archivo token-verify.js

```js
const jwt = require("jsonwebtoken");

const secret = "my super secret key";

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const payload = verifyToken("el.jwt.token", secret);
console.log(payload);
```

Los JWT solo están en base64 y lo que sucede es que están firmados. La información dentro del header y payload se pueden conocer facilmente.

Se puede generar un refresh token, el jwt vence cada 10 o 15 minutos pero la applicación de cliente utiliza el refresh token para volver a generar un jwt.

## Generar JWT en el servicio

1. Creamos una variable de ambiente en el .env

https://keygen.io/

WEP 256-bit Key

```
...
JWT_SECRET=RP2tCqHJSOFWIMV0jxgsEnQBXYdlk6i1
```

2. Incluimos el JWT_SECRET en el config

```js
require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  isProd: process.env.NODE_ENV === "production",
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
  // Aqui
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = { config };
```

3. Esto lo podemos hacer desde el router de authorización (auth.router.js)

```js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { config } = require("./../config/config");

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res, next) => {
    try {
      const user = req.user;
      const payload = {
        sub: user.id,
        role: user.role,
      };
      const token = jwt.sign(payload, config.jwtSecret);
      res.json(req.user);
    } catch (err) {
      next(error);
    }
  }
);
```

4. Cada vez que creemos o cambiemos una variable de ambiente debemos detener nuestro ambiente y volverlo a correr

## Protección de rutas

Ahora es el momento de usar el token para proteger diferentes rutas.

1. Para lograr esto vamos a instalar passport-jwt

> npm install passport-jwt

2. Creamos una nueva estragia

> touch utils/auth/strategies/jwt.strategy.js

```js
const { Strategy, ExtractJwt } = require("passport-jwt");

const { config } = require("./../../config/config");

// jwtFromRequest: Le decimos de donde sacar el token
// secretOrKey: Le indicamos cual es nuestro secreto
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

// La estrategia de passport-jwt nos da el payload ya verificado y la función done
// La estragia sola busca el token en el header como bearer token y lo verificas
const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload);
});

module.exports = JwtStrategy;
```

3. Debemos colocar nuestra estrategia en el archivo utils/auth/index.js

```js
const passport = require("passport");

const LocalStrategy = require("./strategies/local.strategy");
const JwtStrategy = require("./strategies/jwt.strategy");

passport.use(LocalStrategy);
passport.use(JwtStrategy);
```

4. Empezamos a utilizar la estrategia en las rutas por ejemplo en routes/categories.router.js si queremos proteger el endpoint de crear categorias

```js
//...
const passport = require("passport");

//...

// Agregamos passport.authenticate... la estrategia que va a utilizar es jwt (así se llama) y no va manejar sesiones

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validatorHandler(createCAtegorySchema, "body"),
  async (req, res, next) => {
    //...
  }
);
```

Aquí están protegido el endpoint a nivel de autenticación. Pero no a nivel de autorización.

## Control de roles

Aquí vamos a ver como gestionar los roles.

1. Creamos un middleware para verificar que tipo de rol es (Esto es en nuestro auth.handler.js)

```js
// aquí están los otros middlewares

// Como la estrategia de jwt nos devuelve el paylod y lo deja en req.user
function checkAdminRole(req, res, next) {
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else {
    next(boom.unauthorized());
  }
}

module.exports = { checkApiKey, checkAdminRole };
```

2. Ahora seguimos trabajando en el endpoint de creación de categorias...

```js
//...
const passport = require("passport");

const { checkAdminRole } = require("./../middlewares/auth.handler");
//...

// Agregamos el middleware checkAdminRole a los middlewares despues del de passport porque passport coloca el payload en req.user y el checkAdminRole lo espera allí
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkAdminRole,
  validatorHandler(createCategorySchema, "body"),
  async (req, res, next) => {
    //...
  }
);
```

Unado usamos passport, esta librería deja en req.user el payload del jwt

3. Puede ser un poco enredado crear un middleware por cada role y aquí vamos a utilizar una de las caracteristicas de javascript que son lo closures

```js
// aquí están los otros middlewares

// Como la estrategia de jwt nos devuelve el paylod y lo deja en req.user
function checkAdminRole(req, res, next) {
  const user = req.user;
  if (user.role === "admin") {
    next();
  } else {
    next(boom.unauthorized());
  }
}

// Esta función recibe un array de roles y devuelve un middleware
function checkRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
}

module.exports = { checkApiKey, checkAdminRole, checkRoles };
```

4. Y ahora en las rutas

```js
//...
const passport = require("passport");

const { checkRoles } = require("./../middlewares/auth.handler");
//...

// Agregamos el middleware checkAdminRole a los middlewares despues del de passport porque passport coloca el payload en req.user y el checkAdminRole lo espera allí
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkRoles("admin", "seller"),
  validatorHandler(createCategorySchema, "body"),
  async (req, res, next) => {
    //...
  }
);
```

Esto sería de forma que no estemos creando middlewares

Esto sería algo más o menos basico pero también se puede utilizar otras librearías que nos permitan manejar roles de forma más avanzada como por ejemplo accesscontrol

https://www.npmjs.com/package/accesscontrol

> npm install accesscontrol

## Obteniendo órdenes del perfil

Esto sería por si queremos filtrar los datos por el sub que viene en el token.

1. Creamos un nuevo router en routes/profile.route.js

```js
const express = require("express");
const passport = require("passport");

const OrderService = require("../services/order.service");
const service = new OrderService();

const router = express.Router();

router.get(
  "/my-orders",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  }
);
```

2. En el servicio creamos un nuevo metodo para la consulta por perfil

```js
class OrderService {
  async findByUser(userId) {
    // En esta consulta en el where le estoy diciendo que voy a filtrar por un campo de la asociación customer.user.id y por eso son los signos de $
    const orders = models.Order.find({
      where: { "$customer.user.id$": userId },
      include: [
        {
          association: "cutomer",
          include: ["user"],
        },
      ],
    });
    return orders;
  }
}
```

3. Y seguimos en la ruta

```js
const express = require("express");
const passport = require("passport");

const OrderService = require("../services/order.service");
const service = new OrderService();

const router = express.Router();

router.get(
  "/my-orders",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      // El user esta en req
      const user = req.user;
      // El id del usuario está en el sub del jwt
      const orders = await service.findByUser(user.sub);
      res.json();
    } catch (err) {
      next(err);
    }
  }
);
```

4. Agregamos la nueva ruta a nuestro index.js de la carpeta routes

```js
const express = require("express");

const productsRouter = require("./products.router");
const categoriesRouter = require("./categories.router");
const usersRouter = require("./users.router");
const orderRouter = require("./orders.router");
const customersRouter = require("./customers.router");
const authRouter = require("./auth.router");
// Aquí
const profileRouter = require("./profile.router");

function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/products", productsRouter);
  router.use("/categories", categoriesRouter);
  router.use("/users", usersRouter);
  router.use("/orders", orderRouter);
  router.use("/customers", customersRouter);
  router.use("/auth", authRouter);
  router.use("/profile", profileRouter);
}

module.exports = routerApi;
```

El userId no es el mismo que el customerId, pero debería poder a la hora de crear ordenes seleccionar el customerId a partir del userId y así crear la orden

El sub es un identificador, es un subscriber... y normalmente es un código único (una llave primaria) que identifica nuestro usuario

## Manejo de la autenticación desde el cliente

En el cliente deberíamos guardar el token...

**Client Session (Browser)**

- Primero deberíamos en el cliente un estado de login (Puede ser en localStorage que guardemos que el usuario tiene una sesión iniciada)
- Luego el token también deberíamos de guardarlo (aparte del estado de login que seria un login=true) y podríamos guardarlo en un cookie (No es la mejor práctica guardarlo en LocalStorage)
- Cada vez que enviemos una petición deberíamos enviar el Token en el header (Authorization: Bearer my-token)
- El token debería tener una expiración (15 a 20 minutos) y allí se puede implementar una técnica de refresh tokens
- Podemos validar permisos, si ya tengo el token podemos obtener el perfil del usuario del backend para ver que permisos tiene

# Envío de email con Node.js

## Cómo enviar email con Node.js

¿Cómo podemos hacer la recuperación de contraseñas?

1. Instalamos la librería

> npm install nodemailer

https://nodemailer.com/about/

2. Podemos configurar nuestra cuenta de gmail para enviar correos

- Nos vamos a gmail
- Nos vamos a manage your google account
- Nos vamos a seguridad
- Buscamos en Iniciar sesión en Google la parte de contraseñas de aplicaciones
- Ingresamos nuestra contraseña
- En seleccionar aplicaciones le colocamos: Otra (nombre personalizado) y le podemos poner nodeapp
- Le damos click en generar y gmail nos genera una contraseña que nos servira para usar el servidor smtp de gmail

3. Y ahora podemos probarla en programación

```js
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "micuenta@gmail.com", // generated ethereal user
      pass: "el password que me genero", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"micuenta@gmail.com', // sender address
    to: "otracuenta@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
```

4. Y aquí si la probamos

> node nodemailer.js

## Implementando el envío de emails

1. Vamos a implementar la recuperación del password en la ruta de autenticación (auth.router.js)

```js
// Es una nueva ruta

router.post("/recovery", async (req, res, next) => {
  try {
    const { email } = req.body;
  } catch (err) {
    next(err);
  }
});
```

2. Sacamos la lógica de la autenticación a un servicio así que creamos services/auth.service.js

```js
const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { config } = require("./../config/config");

const UserService = require("./user.service");
const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.finByEmail(email);
    if (!user) {
      done(boom.unauthorized(), false);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      donse(boom.unauthorized(), false);
    }
    delete user.dataValues.password;
    return user;
  }

  // Me parece interesante que jwt.sign no es asincrono
  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return { user, token };
  }

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "micorreo@gmail.com",
        pass: "el-password-que-me-genero",
      },
    });
    await transporter.sendMail({
      from: "micorreo@gmail.com",
      to: `${user.email}`,
      subject: "Este es nu nuevo correo",
      text: "Hola mundo",
      html: "<b>Hola mundo</b>",
    });
    return { message: "mail sent" };
  }
}

module.exports = AuthService;
```

3. Cambiamos nuestra local.strategy.js

```js
const { Strategy } = require("passport-local");

const boom = require("@hapi/boom");

const bcrypt = require("bcrypt");

const AuthService = require("./../../../services/auth.service");
const service = new AuthService();

const LocalStrategy = new Strategy(async (username, password, done) => {
  try {
    const user = await service.getByEmail(email);

    if (!user) {
      done(boom.unauthorized(), false);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!iMatch) {
      done(boom.unauthorized(), false);
    }
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

module.exports = LocalStrategy;
```

4. Cambiamos nuestro auth.router.js

```js
const express = require("express");
const passport = require("passport");

const AuthService = require("./../services/auth.service");
const service = new AuthService();

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.signToken(user));
    } catch (err) {
      next(err);
    }
  }
);

router.post("/recovery", async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await service.senMail(email);
    res.json(response);
  } catch (err) {
    next(err);
  }
});
```

# Recuperación de contraseñas

## Generando links de recuperación

1. Cambiamos nuestro AuthService (auth.service.js)

```js
class AuthService {
  // resto del código

  async senRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    // Primero generamos un payload
    const payload = { sub: user.id };
    // Genearmos un token (puedo usar el mismo secre o un secre solo para recovery) este token expira en 15 min
    const token = jwt.sign(payload, config.jwtRecoverySecret, {
      expiresIn: "15min",
    });
    // Creamos un link que debería ser la url de mi frontend... en el link le pongo el token
    const link = `http://myfrontend.com/recovery?token=${token}`;
    // Este token debería guardarlo en mi base de datos para verificarlo
    await service.update(user.id, { recoveryToken: token });

    const recoveryMail = {
      from: config.smtpEmail,
      to: `${user.email}`,
      subject: "Email para recuperar contraseña",
      html: `<b>Ingresa a este link => ${link}</b>`,
    };
    const response = this.sendMail(recoveryMail);
    return response;
  }

  async sendMail(mail) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "micorreo@gmail.com",
        pass: "el-password-que-me-genero",
      },
    });
    await transporter.sendMail(mail);
    return { message: "mail sent" };
  }
}

module.exports = AuthService;
```

2. Deberíamos generar un nueva migración para agregar el campo recovery token

> npm run migrations:generate recovery-token

3. Cambiamos el user.model.js

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
  // Se agrega este campo
  recoveryToken: {
    field: "recovery_token",
    allowNull: true,
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

4. Luego nos vamos al archivo que nos genero la migración

```js
"use strict";

const { USER_TABLE } = require("./../models/user.model");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(USER_TABLE, "recovery_token", {
      field: "recovery_token",
      allowNull: true,
      type: Sequelize.DataTypes.STRING,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(USER_TABLE, "recovery_token");
  },
};
```

5. Corremos la migración

> npm run migrations:run

## Validando tokens para cambio de contraseña

1. Vamos a auth.router.js para generar un nuevo endpoint

```js
router.post("/change-password", async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const resposne = await service.changePassword(token);
    res.json(response);
  } catch (err) {
    next(err);
  }
});
```

2. Cambiamos el AuthService (auth.service.js)

```js
class AuthService {
  async changePassword(token, newPassword) {
    try {
      // Verificamos el token
      const payload = jwt.verify(token, config.recoverySecret);
      // Buscamos el usuario que (si el token esta bien) debería estar en el payload.sub
      const user = service.findOne(payload.sub);
      // Verificamos que el token de la base de datos sea el mismo que me envian
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      // Hash del nuevo password
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, { recoveryToken: null, password: hash });
      return { message: "password changed" };
    } catch (err) {
      throw boom.unauthorized();
    }
  }
}
```

Es recomendable tener 3 firmas diferentes para los tokens.

- 1 Para acceso a recursos
- 1 para refrescar la sesión (refresh token)
- 1 para recuperar contraseñas (recovery token)

# Despliegue a producción

## Deploy en Heroku

> git checkout -b production

1. Para agregar el remote con heroku (esto lo agrega a nuestro proyecto un remote de heroku)

> heroku git:remote -a shrouded-cliffs-34450

2. Se hace esto solo para borrar toda la base de datos ya que es una de pruebas

> heroku run npm run migrations:delete

3. En el proyecto de heroku hay que crear las variables de entorno que configuramos en el proyecto

> heroku config:set API_KEY=123456789 JWT_SECRET=KDJFAKSDJFA SMTP_EMAIL=miemail@gmail.com SMTP_PASSWORD=dkfajsdkfjak

4. Y luego ya puedo hacer un commit y un push

> git add .

> git commit -m "Auth"

> git push herokup production:main

5. Y luego podemos correr las migraciones

> heroku run npm run migrations:run
