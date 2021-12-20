# Introducción

## Historia de JavaScript

Este lenguaje se creó en muy poco tiempo.

http://www.evolutionoftheweb.com/

Cuando nace la web con los primeros navegadores (Netscape). En esta parte era muy dificil encontrar las páginas web pues no había buscadores que indexaran las páginas web. Había páginas en las que había listados de páginas web locales para la comunidad. Los primero sitios eran estáticos y con casí nada de estilo.

JavaScript nace por el fundador Brendan Eich, es el primer desarrollador que genera javascript para Netscape. Mocha nace como en 2 semanas.

1995 --> Mocha --> LiveScript --> JavaScript --> JScript (Microsoft)

1997 --> ECMA (Un grupo para ponerle un orden a los lenguajes que estaban saliendo)

2008 --> V8 (El motor de JavaScript que corre en el navegador Chrome)

2009 --> Node.js (JavaScript para el backend utilizando el motor V8)

2010 --> Frameworks

2015 --> ES6 (ECMA 2015, pues tenemos que ir evolucionando el lenguaje de javascript)

JavaScript se llama así por motivos de marketing dado el auge que estaba teniendo Java en ese tiempo.

**ECMAScript**

Es una especificación estandarizada por **Ecma International**. Fue creado para estandarizar JavaScript y para ayudar a fomentar múltiples implementaciones independientes.

# JavaScript Engine

## ¿Cómo funciona el JavaScript Engine?

Imaginemos que tenemos una lista de tareas. Y esta lista de tareas tiene que hacer que el navegador para que la computadora haga ciertas cosas. Esto lo programamos en JavaScript y el archivo de JavaScript llega al navegador y del navegador a la computadora.

La computadora entiende código de máquina y no JavaScript. Tenemos que hacer algo para que el lenguaje de JavaScript lo entienda la Computadora. El motor de JavaScrip funciona como un intermediario que interpreta JavaScript y lo traduce para la Computadora. Este proceso se conoce como Just In Time Compiler.

## V8, el JavaScript Engine de Chrome

V8 es el motor de JavaScript que corre en el explorador de Chrome. V8 no es el único motor de JavaScript que existe ahora, cada explorador tiene algun motor. V8 ha estado evolucionando muy rápido y ha logrado que JavaScript corra muy rápido y estable. Y otros navegador estan empezando a adoptar el mismo motor.

El motor V8 nace por el proyecto de google maps. Google maps corría lento en los navegadores y Google decide trabajar en un explorador que pudiera correr JavaScript muy rápidamente y que este proyecto corra bien.

## Profundizando en el Engine

Una vez que corre nuestro archivo de JavaScript en el motor V8. Antes de empezar a traducirlo, lo primero que hace el navegador es generar un entorno global llamado Window, que hace 3 cosas:

1. Genera un Global Object (Window)
2. Genera una variable global (this)
3. Y un Outer Environment.

Luego de crear estas 3 cosas entoncesa ya tiene un contexto de ejecución. Allí es donde se corre tu código. Y esta parte lo empieza a correr como un stack de tareas que las va apilando una a una.

1. Empezamos con el documento de JavaScript
2. El motor hace un Parseo completo del archivo de JavaScript, buscando keywords.
3. Estas keywords utiliza para genera un AST (Abstract Syntax Tree)
4. Una vez que tiene ya este árbol, lo lleva a Interpretar
   - Aquí pasa el código por un Profiler (Monitor)
   - El profiler le manda el código al Compilador que optimiza código (Aquí sucede el Hoisting)
   - Y el compilador genera código optimizado
5. Y el interprete le da bytecode a la máquina, este lenguaje ya lo puede entender la máquina.

## Ejemplo de Objeto global y hoisting

Al abrir un explorador e inspeccionar desde la consola podemos ejecutar

> window
>
> this
>
> window == this //verdadero

Esto es porque el navegador crea el entorno global para ejecutar JavaScript.

```javascript
console.log(nombre);
apellido();

var nombre = "Diego";

function apellido() {
  console.log("De Granda");
}
```

Hoisting es este proceso en el cual al momento de estar interpretando, el motor intenta entender que es lo que esta pasando y nos ayuda con ciertas cosas. JavaScript tienen que guardar en memoria las variables y funciones y esto lo guarda en el Memory Heap. El Hoisting pasa solo para var y function. ECMAScript6 nos da nuevas keywords (var, let) para definir variables y evitar así el Hoisting.

El Hoisting a veces funciona, pero no es buena práctica porque no tenemos el control de lo que esta cambiando.

# Código de Ejecución

## Memory Heap

Cuando hablamos de código de ejecución, hablamos del comportamiento de lo que es JavaScript. JavaScript solo puede hacer una tarea a la vez, no mas, es single thread.

El Memory Heap es el lugar donde se van a almacenar las variables y las funciones.

```javascript
var nombre = "Daniel";
const edad = 28;
const carro = { marca: "Toyota", modelo: "2020" };
```

El Memory Heap es como una repisa donde se van a ir guardando las variables y funciones. Para luego poder ejecutarlas. No se guarda de manera lineal, y no sabemos su ubicación en memoria.

## Call Stack

El Call Stack es como se van a mandar a llamar el código de ejecución. Empezamos con un objeto global.

El segundo paso es el Call Stack. Tenemos una pila de tareas que hay que ir ejecutando. Sacandolas empezando de la última a la primera. Una tarea que mande a llamar otra va a poner tareas encima.

JavaScript es de un solo hilo y es Syncrono. Esto significa que solo puede ir trabajando una tarea a la vez.

```javascript
function restarDos(num) {
  return num - 2;
}

function calcular() {
  const sumarTotal = 4 + 5;
  return restarDos(sumarTotal);
}

debugger;

calcular();
```

## Garbage Collection

JavaScript nos ayuda con este proceso con algo que se llama Mark and Sweep. Cuando hay cosas en el Stack que ya no se están utilizando, simplemente se hace un Mark y después Sweep a todo lo marcado.

```javascript
var carro = {
  marca: "Toyota",
  modelo: "2020",
};

carro = "Toyota";
```

## Stack overflow

Cuando tenemos el Call Stack y empezamos a apilar tareas iniciando con el Global Object y todo el código que estemos ejecutando crea tareas nuevas en el Stack. Podríamos llegar a mandar demasiadas tareas al Stack causando un Stack Overflow. Actualmente Chrome al detectar que se está ejecutando código que puede causar un Stack Overflow entonces lo deja de ejecutar.

Hay que tener control de los loops infinitos y cuando trabajemos con temas de Recursión para no generar un Stack Overflow.

## JavaScript Runtime

JavaScript es sincrono. Esto hace que se pueda comportar lento o nos de tiempo de espera un poco largo.

El JavaScript Runtime está compuesto de:

1. Memory Heap
2. Call Stack

-----Asyncrrhonous-----

3. Web APIs (DOM (Document), AJAX (XMLHttpRequest), Timeout (setTimeout))
4. Event Loop
5. Callback queue

En la consola del navegador

> window

Y allí nos muestra las api del navegador. O aquí

https://developer.mozilla.org/en-US/docs/Web/API

## Asincronía

Si en el callStack encuentra alguna función que le pertenece al navegador se la delega al navegador y sigue ejecutando las tareas que le competen.

Las tareas el navegador las pone en un callback queue y las tareas en el callback queue son ejecutadas por el event loop.

## Recapitulación

- Que es el JavaScript Engine
- Que es y cómo funciona V8
- Que es el Entorno y Objeto Global
- Hoisting y cómo evitarlo
- Cómo funciona el JIT Compiler
- Sincronía y asincronía de JavaScript
- Que es el Memory heap y Call Stack
- Que es un Stack Overflow
- Cómo funciona JavaScript Runtime
