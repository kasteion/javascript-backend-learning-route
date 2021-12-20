const helloWorld = () => {
  const hello = "Hello World";
  console.log(hello);
};

helloWorld();

var scope = "I am Glovar!";

const functionScope = () => {
  // Esta variable se ejecutará en el ambito léxico, o sea que aquí estoy
  // creando otra variable que no es la global y solo estoy trabajando en esta
  // nueva variable dentro de la función.
  var scope = "I am a local var";
  const func = () => {
    return scope;
  };
  console.log(func());
};

functionScope();
console.log(scope);
// Esto va a fallar miserablemente...
//console.log(hello);
