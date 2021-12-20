const express = require('express');

const router = express.Router();

router.get('/categories', (req, res) => {
  res.json([
    { name: 'Category 1', desc: 'Description 1' },
    { name: 'Category 2', desc: 'Description 2' },
  ]);
});

router.get('/categories/:categoryId/products/:productId', (req, res) => {
  const { categoryId, productId } = req.params;
  res.json({
    categoryId,
    productId,
  });
});

module.exports = {
  categoriesRouter: router,
};
