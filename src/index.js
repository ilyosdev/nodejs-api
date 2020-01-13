const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const index = express();

index.use(cors());
index.use(bodyParser.json());

routes(index);

module.exports = index;
