# Introducción

## Acerca de NPM, paquetes y módulos

NPM es Node Package Manager. NPM es un gestor de paquetes, el más popular que tiene Javascript. Donde podremos encontrar muchos recursos para los proyectos o crear paquetes para compartirlos con la comunidad.

# Instalación

Primero hay que instalar NodeJS

> node -v
>
> npm -v
>
> sudo npm install -g npm@latest

# Configuración

## Iniciar un proyecto

Es importante iniciar el proyecto con npm porque así dejamos una configuración para poder configurar nuestro entorno y compartirlo con otros desarrolladores.

> git init
>
> npm init
>
> npm init -y

Se puede setear la configuración de los valores por defecto

> npm set init.author.email "user@email.com"
>
> npm set init.author.name "kasteion"
>
> npm set init.license "MIT"

## Instalación de dependencias

> mkdir src
>
> touch src/index.js

Podemos instalar los paquetes como necesarios para producción.

> npm install moment
>
> npm install moment --save
>
> npm i moment -S

Podemos instalar los paquetes solo para el ambiente de desarrollo

> npm install date-fns --save-dev
>
> npm i date-fns -D

Para instalar un paquete global

> sudo npm i -g nodemon

Si queremos ver una lista de paquetes instalados de forma global podemos ejecutar:

> npm list -g --depth 0

Podemos instalar paquetes de forma opcional:

> npm install eslint -O

Para ver que paquetes están solicitando sponsors

> npm fund

## Instalación de dependencias con force

La opción --dry-run hace una simulación de la instalación pero no la hace.

> npm install react --dry-run

Tambien podemos forzar que se instale una dependencia desde la última versión de los servidores de npm

> npm install webpack -f

Las dependencias si nos equivocamos entre producción y desarrollo podemos moverlas de producción a desarrollo o viseversa. Y luego...

> npm install

Si conocemos la versión particular que vamos a utilizar podemos indicarle una versión especifica al paquete.

> npm install json-server@0.15.0

## Actualizar y eliminar paquetes

El comando para ver un arbol de paquetes instalados en el proyecto es:

> npm list

Para ver que paquetes están desactualizados

> npm outdate

Si queremos ver todo el output que corre por detras

> npm outdate --dd

Para actualizar todos los paquetes ejecutamos:

> npm update

Para actualizar un solo paquete:

> npm install json-server@latest

Podemos desinstalar con

> npm uninstall json-server

Hay un comando para desinstalarlo de la máquina pero sin eliminarlo del archivo de package con:

> npm uninstall webpack --no-save

## Package lock y el uso de los simbolos ^ y ~

La importancia del versionado semántico y del archivo package.lock

Cuando se versionan paquetes normalmente se dedtallan 3 valores. Ejemplo: 3.9.2 y esto esta puesto como major.minor.patch

El primer valor siempre es un cambio mayor que posiblemente tenga cambios grandes y que rompan todos.

Luego tenemos cambios menores, funcionalidades nuevas con backward compatibility. Funciones antiguas deprecadas pero que todavía estan operacionales. O hubo refactorización del código.

Y luego los parches que son correcciones de errores.

Las dependecias a veces tienen está versión ^3.9.2, eso significa que solo haremos permitiremos actualizaciones de los cambios menores y lo bug fixes del paquete.

También podemos establecer la tilde en la configuración, por ejemplo: ~3.9.2 esto es para que solo se actualicen bug fixes.

Esto es para controlar que versiones queremos actualizar. Entonces podemos borrar el ^ para que no se actualice.

## Ejecutar tareas

En el archivo package.json hay una sección llamada scripts. Los script son comandos que podemos establecer para ejecutar desde la consola. Ejemplo:

```json

"scripts": {
    "buid": "webpack --mode production",
    "start": "webpack-dev-server --open --mode development",
    "format": "prettier --write '{*.js, src/**/*.{js,jsx}}'",
    "lint": "eslint src/ --fix",
    "deploy": "npm run format && npm run build"
},

```

Nosotros podemos crear la cantidad de scripts que necesitemos y podemos ejecutarlo desde la terminal. Estos comandos los ejecutamos así:

> npm run deploy

También podemos llamar a test y start asÍ:

> npm test
>
> npm start

## Solución de problemas

Al trabajar con proyecto que utilizan npm uno se puede topar con una gran cantidad de posibles errores. Configuración, Sistema Operativo, Espacios, No haber configurado correctamente mi github, no haber establecido bien los datos del package, haber dejado un caracter extraño en la configuración.

> npm run build --dd

Cuando el npm run da un error... genera un archivo de log al cual le podemos dar una miradita.

El cache de npm se puede limpiar ejecutando:

> npm cache clean --force

Y luego verificamos que se haya borrado el cache con:

> npm cache verify

También podríamos borrar node_modules

> rm -rf node_modules/

Y luego podemos volver a ejecutar

> npm install

Hay un módulo de npm que se puede instalar de forma global

> sudo npm install -g rimraf
>
> rimraf node_modules

## Seguridad

La importancia de la seguridad dentro de nuestros proyectos es parte de nosotros como desarrolladores.

> npm audit

Este comando genera un archivo json con la auditoría.

> npm audit --json

Para actualizar un paquete podemos ejecutar:

> npm update eslint-utils --depth 2

Depth 2 significa que va a actualizar el paquete y las dependencias.

El comando npm audit fix trata de repara todas las vulnerabilidades que se encuentren en el proyecto.

> npm audit fix

Existe un proyecto llamado snyk.io que se dedica a revisar tus proyectos para asegurarse de tener tus dependencias actualizadas.

# Publicar un paquete

## Crear un paquete para NPM

> mkdir random-messages
>
> cd random-messages
>
> git init
>
> npm init

Escribo el código en src/index.js

También necesito crear una carpeta llamada bin ( a la misma altura de source) y dentro de esta carpeta un archivo llamado global.js

Y al final de archivo package.json podemos agregar la configuración:

```json

    "bin": {
    "random-msg": "./bin/global.js"
  },
  "preferGlobal": true

```

Estando dentro de la carpeta donde creamos el paquete ejecutamos el comando

> sudo npm link

Esto es para hacer una referencia a este paquete a la configuración global de mi equipo... como si lo hubiera instalado desde npm... Entonces para ejecutarlo:

> random-msg

También podemos instalarlo desde el path en que tenemos el paquete:

> sudo npm install -g /home/kasteion/source/repos/javascript-backend-learning-route/07-npm/random-messages

## Publicar un paquete en NPM

Para publicar a npm necesitamos un usuario de npm con el cual registrarnos y logearnos desde la consola...

> npm adduser

Pide usuario, password, email. Una vez logeado puedo ejecutar:

> npm publish

## Paquetes privados

Para que el paquete sea considerado un buen paquete va a necesitar un buen readme...

Explicar que hace el paquete, como se instala, que comandos tiene, invitar a la gente a contribuír al proyecto. También hay que conectarlo a un repositorio para poderlo mandar.

Para unirlo a un repositorio...

> git remote add origint https://github.com/platzi/npm-random-msg.git

Cuando ya linkeamos a un repositorio ejecutamos nuevamente:

> npm init

Y npm debería reconocer que tiene un repositorio configurado...

> npm version patch

Si hicimos un cambio menor es `npm version minor` o si es un cambio mayor `npm version major`.

Y para publicar:

> npm publish

Npm también tienen una versión enterprise. Para trabajar en una empresa, tal vez con equipos de trabajo, para repositorios privados.
