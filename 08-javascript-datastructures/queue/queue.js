class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }

  enqueue(value) {
    const node = new Node(value);
    if (this.length === 0) {
      this.first = node;
      this.last = this.first;
    } else {
      this.last.next = node;
      this.last = this.last.next;
    }
    this.length++;
    return this.first;
  }

  dequeue() {
    const node = this.first;
    if (this.first) {
      this.first = this.first.next;
    } else {
      this.first = null;
      this.last = this.first;
    }
    this.length--;
    return node;
  }

  peek() {
    return this.first;
  }
}

const myQueue = new Queue();
console.log(myQueue);
myQueue.enqueue(0);
myQueue.enqueue(1);
console.log(myQueue.dequeue());
myQueue.enqueue(2);
myQueue.enqueue(3);
myQueue.enqueue(4);
console.log(myQueue.dequeue());
myQueue.enqueue(5);
console.log(myQueue.dequeue());
console.log(myQueue.dequeue());
myQueue.enqueue(6);
console.log(myQueue.dequeue());
console.log(myQueue.dequeue());
console.log(myQueue.dequeue());
console.log(myQueue.last);
console.log(myQueue.first);
console.log(myQueue.dequeue());
console.log(myQueue.peek());
