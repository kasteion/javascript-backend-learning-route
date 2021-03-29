class HashTable {
  constructor(size) {
    this.data = new Array(size);
  }

  hashMethod(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * i) % this.data.length;
    }
    return hash;
  }

  set(key, value) {
    const address = this.hashMethod(key);
    if (!this.data[address]) {
      this.data[address] = [];
    }
    this.data[address].push([key, value]);
    return this.data;
  }

  get(key) {
    const address = this.hashMethod(key);
    const currentBucket = this.data[address];
    if (currentBucket) {
      for (let i = 0; i < currentBucket.length; i++) {
        if (currentBucket[i][0] === key) {
          return currentBucket[i];
        }
      }
    }
    return undefined;
  }

  //delete(key)
  delete(key) {
    const address = this.hashMethod(key);
    const currentBucket = this.data[address];
    if (currentBucket) {
      for (let i = 0; i < currentBucket.length; i++) {
        if (currentBucket[i][0] === key) {
          const keyValuePair = currentBucket[i];
          currentBucket.splice(i, 1);
          delete currentBucket[i];
          if (!currentBucket[0] && currentBucket.length === 1) {
            delete this.data[address];
          }
          return keyValuePair;
        }
      }
    }
    return undefined;
  }

  //getKey
}

const myHashTable = new HashTable(50);
console.log("-----------");
console.log("--> SET <--");
console.log("-----------");
console.log(myHashTable);
console.log(myHashTable.set("Diego", 1990));
console.log(myHashTable.set("Mariana", 1998));
console.log(myHashTable.set("Alejandro", 2000));
console.log(myHashTable.set("Juliana", 1985));
console.log("-----------");
console.log("--> GET <--");
console.log("-----------");
console.log(myHashTable.get("Alejandro"));
console.log(myHashTable.get("Juliana"));
console.log(myHashTable.get("Diego"));
console.log(myHashTable.get("Luis"));
console.log("--------------");
console.log("--> DELETE <--");
console.log("--------------");
console.log(myHashTable.delete("Alejandro"));
console.log(myHashTable);
console.log(myHashTable.set("Alejandro", 2000));
console.log(myHashTable.delete("Mariana"));
console.log(myHashTable);
