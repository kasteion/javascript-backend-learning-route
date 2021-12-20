const fruits = () => {
  // Si lo declar todo como var entonces puedo acceder a las variables fuera
  // del if. Pero con let y const solo pueden existir dentro del if.
  if (true) {
    var fruit1 = "Apple";
    //var fruit2 = "Banana";
    //var fruit3 = "Kiwi";
    let fruit2 = "Banana";
    const fruit3 = "Kiwi";
    console.log(fruit2);
    console.log(fruit3);
  }

  console.log(fruit1);
  //console.log(fruit2);
  //console.log(fruit3);
};

fruits();

// Esto imprime
// 2
// 1

let x = 1;

{
  let x = 2;
  console.log(x);
}

console.log(x);

// Esto imprime:
// 2
// 2

var y = 1;

{
  var y = 2;
  console.log(y);
}

console.log(y);

const anotherfunction = () => {
  for (var i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
};

anotherfunction();

const yetanotherfunction = () => {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
};

yetanotherfunction();
