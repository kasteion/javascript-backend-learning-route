const express = require('express');
// const faker = require('faker');

const { routerApi } = require('./routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/new', (req, res) => {
  res.send('Hello, i am a new route');
});

routerApi(app);
// app.get('/products', (req, res) => {
//   const products = [];
//   const { size } = req.query;
//   const limit = size || 10;
//   for (let i = 0; i < limit; i++) {
//     products.push({
//       name: faker.commerce.productName(),
//       price: parseInt(faker.commerce.price(), 10),
//       image: faker.image.imageUrl(),
//     });
//   }
//   res.json(products);
// });

// app.get('/products/:id', (req, res) => {
//   const { id } = req.params;
//   res.json({
//     id,
//     name: 'Product 1',
//     price: 100,
//   });
// });

app.get('/home', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
