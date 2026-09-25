const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const app = express();

app.use(express.json());

// Route Healthcheck
app.get('/health', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ status: 'UP', database: 'CONNECTED' });
  }
  res.status(500).json({ status: 'DOWN', database: 'DISCONNECTED' });
});

// CRUD Routes
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/products/:pid', async (req, res) => {
  const product = await Product.findOne({ pid: req.params.pid });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.put('/api/products/:pid', async (req, res) => {
  const product = await Product.findOneAndUpdate({ pid: req.params.pid }, req.body, { new: true });
  res.json(product);
});

app.delete('/api/products/:pid', async (req, res) => {
  await Product.findOneAndDelete({ pid: req.params.pid });
  res.json({ message: 'Deleted successfully' });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Could not connect to MongoDB', err));