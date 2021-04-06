const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: '',
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

app.put // para actualizar
app.delete // para borrar
// Update de un producto
// Delete de un producto

app.listen(port, () => {
  console.log(`Api de Express escuchando en el puerto ${port}`);
});
