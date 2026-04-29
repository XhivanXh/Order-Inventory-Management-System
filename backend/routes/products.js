const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single product by id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// ADD new product
router.post('/', (req, res) => {
  const { name, category, price, quantity, description } = req.body;
  db.query(
    'INSERT INTO products (name, category, price, quantity, description) VALUES (?, ?, ?, ?, ?)',
    [name, category, price, quantity, description],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: results.insertId, name, category, price, quantity, description });
    }
  );
});

// UPDATE product
router.put('/:id', (req, res) => {
  const { name, category, price, quantity, description } = req.body;
  db.query(
    'UPDATE products SET name=?, category=?, price=?, quantity=?, description=? WHERE id=?',
    [name, category, price, quantity, description, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// DELETE product
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;