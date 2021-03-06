const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: 'Bolt2508*',
  database: 'inventory',
});

app.get('/', (req, res) => {
  res.send('Hola, mundo!');
});

// Get de todos los productos
app.get('/api/products', (req, res) => {
  pool.query('SELECT * FROM products', function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Products getted',
      products: result,
    });
  });
});

// Insert de un nuevo producto
app.post('/api/products/create', (req, res) => {
  const {
    storeId,
    departmentId,
    name,
    brand,
    description,
    stock,
  } = req.body;

  const query = `INSERT INTO products
                (store_id, department_id, name, brand, description, stock)
                VALUES (${storeId}, ${departmentId}, '${name}', '${brand}', '${description}', ${stock})`;
  
  pool.query(query, function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Product created',
    });
  });
});

// Update
app.put('/api/products/update', (req, res) => {
  const {
    productId,
    storeId,
    departmentId,
    name,
    brand,
    description,
    stock,
  } = req.body;
  const query = `UPDATE products SET
                store_id = ${storeId},
                department_id = ${departmentId},
                name = '${name}',
                brand = '${brand}',
                description = '${description}',
                stock = ${stock}
                WHERE product_id = ${productId}`;
  pool.query(query, function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Product updated successfully',
    });
  });
});

// Delete
app.delete('/api/products/delete', (req, res) => {
  const { product_id } = req.body;

  const query = `DELETE FROM products WHERE product_id = ${product_id}`;
  pool.query(query, function (error, result, fields) {
    if (error) {
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Product deleted successfully',
    });
  });
});

// Get de un producto
app.get('/api/products/get/:productId', (req, res) => {
  const { productId } = req.params;
  pool.query(`SELECT * FROM products WHERE product_id = ${productId}`, function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Product getted',
      product: result[0],
    });
  });
});

// B??squeda
app.get('/api/products/search/:searchInfo', (req, res) => {
  const { searchInfo } = req.params;
  const query = `SELECT * FROM products WHERE
                name LIKE '%${searchInfo}%' OR
                description LIKE '%${searchInfo}%' OR
                brand LIKE '%${searchInfo}%'`;
  pool.query(query, function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Product getted',
      products: result,
    });
  });
});

// Get de todos los departamentos
app.get('/api/departments', (req, res) => {
  pool.query('SELECT * FROM departments', function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Departments getted',
      departments: result,
    });
  });
});

// Get de todas las tiendas
app.get('/api/stores', (req, res) => {
  pool.query('SELECT * FROM stores', function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Stores getted',
      stores: result,
    });
  });
});

app.post('/api/stores/create', (req, res) => {
  const {
    name,
    address,
  } = req.body;

  const query = `INSERT INTO stores
                (name, address)
                VALUES ('${name}', '${address}')`;
  
  pool.query(query, function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Store created',
    });
  });
});

// Update
app.put('/api/stores/update', (req, res) => {
  const {
    storeId,
    name,
    address,
  } = req.body;
  const query = `UPDATE stores SET
                name = '${name}',
                address = '${address}'
                WHERE store_id = ${storeId}`;
  pool.query(query, function (error, result, fields) {
    if (error) {
      console.log(error);
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Store updated successfully',
    });
  });
});

// Delete
app.delete('/api/stores/delete/:storeId', (req, res) => {
  const { storeId } = req.params;

  const query = `DELETE FROM stores WHERE store_id = ${storeId}`;
  pool.query(query, function (error, result, fields) {
    if (error) {
      res.json({
        status: 500,
        message: 'Error in sql statement',
      });
    }
    res.json({
      status: 200,
      message: 'Store deleted successfully',
    });
  });
});

app.listen(port, () => {
  console.log(`Api de Express escuchando en el puerto ${port}`);
});
