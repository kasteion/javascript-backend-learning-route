class MyArray {
  constructor() {
    this.length = 0;
    this.data = {};
  }

  get(index) {
    return this.data[index];
  }

  push(item) {
    this.data[this.length] = item;
    this.length++;
    return this.data;
  }

  pop() {
    const item = this.data[this.length - 1];
    // let data = {};
    // for (let i = 0; i < this.length - 1; i++) {
    //   data[i] = this.data[i];
    // }
    // this.data = data;
    delete this.data[this.length - 1];
    this.length--;
    return item;
  }

  delete(index) {
    const item = this.data[index];
    this.shiftIndex(index);
    this.length--;
    return item;
  }

  shiftIndex(index) {
    for (let i = index; i < this.length - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    delete this.data[this.length - 1];
  }

  shift() {
    const item = this.data[0];
    this.shiftIndex(0);
    this.length--;
    return item;
  }

  unshift(item) {
    this.push("");
    this.unshiftIndex();
    this.data[0] = item;
  }

  unshiftIndex() {
    for (let i = this.length - 1; i > 0; i--) {
      this.data[i] = this.data[i - 1];
    }
  }
}

const array = new MyArray();
array.push("Jose");
array.push("Adriana");
array.push("Julian");
//console.log(array.length);
console.log("------------------");
console.log("--> GET Y PUSH <--");
console.log("------------------");
console.log(array);
console.log(array.get(0));
console.log(array.get(1));
console.log(array.get(2));
console.log("------------------");
console.log("-->    POP     <--");
console.log("------------------");
let item = array.pop();
console.log(item);
//console.log(array.length);
console.log(array);
console.log(array.get(0));
console.log(array.get(1));
console.log("------------------");
console.log("-->   DELETE   <--");
console.log("------------------");
array.push("Veronica");
console.log(array);
item = array.delete(1);
console.log(item);
console.log(array);
console.log("------------------");
console.log("-->    SHIFT   <--");
console.log("------------------");
array.push("Daniel");
console.log(array);
item = array.shift();
console.log(item);
console.log(array);
console.log("------------------");
console.log("-->   UNSHIFT  <--");
console.log("------------------");
array.unshift("Sara");
console.log(array);
