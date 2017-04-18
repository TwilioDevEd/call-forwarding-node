'use strict';

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const urlencoded = require('body-parser').urlencoded;

const routes = require('./routes/index');
const app = express();

// View engine setup
app.set('view engine', 'pug');

// Application setup
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;