class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  search(value) {
    let next = this.root;
    while (next) {
      if (value === next.value) {
        return next;
      } else if (value > next.value) {
        next = next.right;
      } else if (value < next.value) {
        next = next.left;
      }
    }
    return next;
  }

  insert(value) {
    const nodo = new Node(value);
    if (this.root) {
      let prev = this.root;
      let next = this.root;
      while (next) {
        prev = next;
        if (nodo.value === next.value) {
          next = null;
        } else if (nodo.value > next.value) {
          next = next.right;
        } else {
          next = next.left;
        }
      }
      if (nodo.value > prev.value) {
        prev.right = nodo;
      } else if (nodo.value < prev.value) {
        prev.left = nodo;
      }
    } else {
      this.root = nodo;
    }
    return this.root;
  }

  delete(value) {}
}

const myBinarySearchTree = new BinarySearchTree();
myBinarySearchTree.insert(10);
myBinarySearchTree.insert(20);
myBinarySearchTree.insert(170);
myBinarySearchTree.insert(17);
myBinarySearchTree.insert(4);
myBinarySearchTree.insert(8);
myBinarySearchTree.insert(2);
myBinarySearchTree.insert(21);
console.log(myBinarySearchTree.insert(20));
console.log(myBinarySearchTree.search(170));
