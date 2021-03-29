// 1 -> 2 -> 3 -> 4 -> 5 -> null

class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class MySinglyLinkedList {
  constructor(value) {
    this.head = new Node(value);
    this.tail = this.head;
    this.length = 1;
  }

  //prepend
  prepend(value) {
    // Código curso:
    // const newNode = new Node(value);
    // newNode.next = this.head;
    // this.head = newNode;
    // this.length++;
    // return this;

    // Mi código:
    const nodo = new Node(value);
    nodo.next = this.head;
    this.head.prev = nodo;
    this.head = nodo;
    this.length++;
    return this.head;
  }
  //append
  append(value) {
    // Código curso:
    // const newNode = new Node(value);
    // this.tail.next = newNode;
    // this.tail = newNode;
    // this.length++;
    // return this;

    // Mi código:
    const nodo = new Node(value);
    nodo.prev = this.tail;
    this.tail.next = nodo;
    this.tail = nodo;
    this.length++;
    return this.head;
  }

  //search
  search(index) {
    let nodo;
    nodo = this.head;
    for (let i = 1; i <= index; i++) {
      nodo = nodo.next;
    }
    return nodo;
  }

  //insert
  insert(index, value) {
    let prevnode;
    let nextnode;
    if (index === 0) {
      return this.prepend(value);
    } else if (index >= this.length) {
      return this.append(value);
    } else {
      prevnode = this.search(index - 1);
      nextnode = this.search(index);
    }
    const nodo = new Node(value);
    nodo.next = prevnode.next;
    nodo.prev = prevnode;
    prevnode.next = nodo;
    nextnode.prev = nodo;
    this.length++;
    return this.head;
  }

  //delete
  delete(index) {
    if (index === 0) {
      const nextNode = this.head.next;
      this.head = nextNode;
      this.head.prev = null;
      this.length--;
    } else if (index < this.length - 1) {
      const prevNode = this.search(index - 1);
      const nextNode = this.search(index + 1);
      prevNode.next = nextNode;
      nextNode.prev = prevNode;
      this.length--;
    } else if (index === this.length - 1) {
      const prevNode = this.search(index - 1);
      prevNode.next = null;
      this.length--;
    }
    return this.head;
  }

  print(index) {
    const nodo = this.search(index);
    console.log(
      `${nodo.prev ? nodo.prev.value : "null"} <-- ${nodo.value} --> ${
        nodo.next ? nodo.next.value : "null"
      }`
    );
  }
}

let myLinkedList = new MySinglyLinkedList(3);
//console.log(myLinkedList);
myLinkedList.append(4);
//console.log(myLinkedList);
myLinkedList.append(6);
myLinkedList.prepend(2);
myLinkedList.prepend(1);
myLinkedList.insert(0, 0);
myLinkedList.insert(6, 7);
myLinkedList.insert(5, 5);
//console.log(myLinkedList);
//myLinkedList.prepend(4);
console.log(myLinkedList);
// console.log(myLinkedList.insert(3, 5));
// console.log(myLinkedList.insert(0, 6));
// console.log(myLinkedList.insert(7, 7));
// console.log(myLinkedList);
myLinkedList.print(0);
myLinkedList.print(1);
myLinkedList.print(2);
myLinkedList.print(3);
myLinkedList.print(4);
myLinkedList.print(5);
myLinkedList.print(6);
myLinkedList.print(7);

myLinkedList.delete(0);
myLinkedList.delete(6);
myLinkedList.delete(4);

myLinkedList.print(0);
myLinkedList.print(1);
myLinkedList.print(2);
myLinkedList.print(3);
myLinkedList.print(4);
