const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve the static frontend files from the sibling directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Catch-all route to serve inventory.html as the homepage
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'inventory.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
