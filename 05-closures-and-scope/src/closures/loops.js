// Aquí involuntariamente estabamos creando un closure, esto se soluciona
// cambiando el var por un let que respeta el scope.

const anotherFunction = () => {
  for (var i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
};

anotherFunction();

const yetanotherFunction = () => {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
};

yetanotherFunction();
