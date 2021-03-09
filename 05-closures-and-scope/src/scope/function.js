const fruits = () => {
  var fruit = "Apple";
  console.log(fruit);
};

fruits();
// Esto no se puede porque la variable existe en el scope de la función.
//console.log(fruit);

const anotherfunction = () => {
  var x = 1;
  var x = 2;
  let y = 1;
  //let y = 2;
  console.log(x);
  console.log(y);
};

anotherfunction();
