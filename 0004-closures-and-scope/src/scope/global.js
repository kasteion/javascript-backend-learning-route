var hello = "Hello";
// Declarar variables con var permite volver a declarar la variable
// efectivamente sobre escribiendola.
var hello = "Hello++";
let world = "Hello World";
const helloWorld = "Hello World!";

const anotherFunction = () => {
  console.log(hello);
  console.log(world);
  console.log(helloWorld);
};

anotherFunction();

// Esto se puede hacer pero es una mala práctica... puedo declarar una variable
// dentro de una función y esta va a ser global a pesar que debería tener un
// scope local
const glovarFunction = () => {
  glovar = "I'm Glovar!";
};

glovarFunction();
console.log(glovar);

const glovarFunction2 = () => {
  var lovar = (glovar2 = "I'm Glovar2!");
};

glovarFunction2();
console.log(glovar2);
