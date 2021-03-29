// 1 -> 2 -> 3 -> 4 -> 5 -> null

class Node {
  constructor(value) {
    this.value = value;
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
    this.tail.next = nodo;
    this.tail = this.tail.next;
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
    if (index === 0) {
      return this.prepend(value);
    } else if (index >= this.length) {
      return this.append(value);
    } else {
      prevnode = this.search(index - 1);
    }
    const nodo = new Node(value);
    nodo.next = prevnode.next;
    prevnode.next = nodo;
    this.length++;
    return this.head;
  }

  //delete
  delete(index) {
    if (index === 0) {
      const nextNode = this.head.next;
      this.head = nextNode;
      this.length--;
    } else if (index < this.length) {
      const prevNode = this.search(index - 1);
      const nextNode = this.search(index + 1);
      prevNode.next = nextNode;
      this.length--;
    } else if (index === this.length) {
      const prevNode = this.search(index - 1);
      prevNode.next = null;
      this.length--;
    }
    return this.head;
  }
}

let myLinkedList = new MySinglyLinkedList(1);
console.log(myLinkedList);
console.log(myLinkedList.append(2));
//console.log(myLinkedList);
console.log(myLinkedList.append(3));
console.log(myLinkedList);
console.log(myLinkedList.prepend(4));
console.log(myLinkedList);
console.log(myLinkedList.insert(3, 5));
console.log(myLinkedList.insert(0, 6));
console.log(myLinkedList.insert(7, 7));
console.log(myLinkedList);
console.log(myLinkedList.search(0));
console.log(myLinkedList.search(1));
console.log(myLinkedList.search(2));
console.log(myLinkedList.search(3));
console.log(myLinkedList.search(4));
console.log(myLinkedList.search(5));
console.log(myLinkedList.search(6));
console.log(myLinkedList.delete(0));
console.log(myLinkedList.delete(5));
console.log(myLinkedList.delete(2));
console.log(myLinkedList.search(0));
console.log(myLinkedList.search(1));
console.log(myLinkedList.search(2));
console.log(myLinkedList.search(3));
