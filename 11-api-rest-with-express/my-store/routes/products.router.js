const express = require('express');

const ProductsService = require('../services/products.services');

const router = express.Router();
const service = new ProductsService();

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit || 0, 10);
  const offset = parseInt(req.query.offset || 0, 10);
  const products = await service.find(limit, offset);
  res.status(200).json(products);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await service.findOne(id);
  if (!product) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  res.status(200).json({ product });
});

router.post('/', async (req, res) => {
  const body = req.body;
  const product = await service.create(body);
  res.status(201).json({
    message: 'Created',
    data: product,
  });
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const updated = await service.update(id, body);
    res.json({
      updated,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await service.update(id);
    res.json({
      result,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = { productsRouter: router };
