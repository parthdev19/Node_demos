const express = require('express');
const morgan = require('morgan'); // Import morgan
require('dotenv').config();
const port = process.env.PORTS;
const studentRouter = require('./router/R_students');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use morgan middleware
app.use(morgan('dev')); // Logs HTTP requests in 'dev' format

app.use(studentRouter);

app.listen(port, () => {
    console.log(`Server is Running on ${port}`);
});
