const myName: string = 'Fredy';
const myAge: number = 35;

const suma = (a: number, b: number) => {
  return a + b;
};

class Persona {
  // private age: number;
  // private name: string;

  // constructor(age: number, name: string) {
  //   this.age = age;
  //   this.name = name;
  // }

  // Es lo mismo que:

  constructor(private age: number, private name: string) {}

  getSumary() {
    return `my name is ${this.name}, ${this.age}`;
  }
}

const fredy = new Persona(35, 'Fredy');
console.log(fredy.getSumary());
