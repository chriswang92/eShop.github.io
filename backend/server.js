import express from 'express'; // 'require' is common js which is traditionally what nodejs is use, on frontend we use 'import' which is es modules
import dotenv from 'dotenv';
import products from './data/products.js';

dotenv.config()

const app = express();

app.get('/', (req, res) => {
  // send string response to client
  res.send('API is running23...');
});

app.get('/api/products', (req, res) => {
  // send JSON response to client
  // products here is a js array with objects
  // res.json or res.send will convert the object to JSON content-type
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
