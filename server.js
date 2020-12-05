const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { join } = require('path');

const app = express();

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(helmet());
app.use('/api', createProxyMiddleware({ target: 'http://localhost:3001' }));
app.use(express.static(join(__dirname, 'build')));
app.use('*', express.static(join(__dirname, 'build')));

app.listen(port, () => console.log(`Server listening on port ${port}`));
