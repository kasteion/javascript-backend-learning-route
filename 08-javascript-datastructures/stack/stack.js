class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.top = null;
    this.bottom = null;
    this.length = 0;
  }

  peek() {
    return this.top;
  }

  pop() {
    const out = this.top;
    if (this.top.next) {
      this.top = this.top.next;
    } else {
      this.top = null;
      this.bottom = null;
    }
    this.length--;
    return out;
  }

  push(value) {
    const node = new Node(value);
    if (this.length === 0) {
      this.top = node;
      this.bottom = this.top;
    } else {
      node.next = this.top;
      this.top = node;
    }
    this.length++;
    return this.bottom;
  }
}

const myStack = new Stack();
console.log(myStack);
myStack.push(0);
myStack.push(1);
myStack.push(2);
myStack.push(3);
myStack.push(4);
console.log(myStack);
console.log(myStack.peek());
console.log(myStack);
console.log(myStack.pop());
console.log(myStack.pop());
console.log(myStack.pop());
console.log(myStack);
console.log(myStack.pop());
console.log(myStack.pop());
console.log(myStack);
