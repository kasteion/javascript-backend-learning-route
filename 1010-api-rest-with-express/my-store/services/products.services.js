const faker = require('faker');

class ProductsService {
  constructor() {
    this.products = [];
    this.generate();
  }

  generate() {
    for (let i = 0; i < 100; i++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
      });
    }
  }

  async create(data) {
    const product = {
      id: faker.datatype.uuid(),
      ...data,
    };
    this.products.push(product);
    return product;
  }

  find(limit, offset = 0) {
    if (!limit)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.products);
        }, 5000);
      });
    limit + offset > this.products.length
      ? (limit = this.products.length)
      : (limit = limit + offset);
    const productsSubset = [];
    for (let i = offset; i < limit; i++) {
      productsSubset.push(this.products[i]);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(productsSubset);
      }, 5000);
    });
  }

  async findOne(id) {
    const product = this.products.find((p) => p.id === id);
    return product;
  }

  async update(id, changes) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.products[index] = { ...this.products[index], ...changes };
    return this.products[index];
  }

  async delete(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.products.splice(index, 1);
    return { id };
  }
}

module.exports = ProductsService;
