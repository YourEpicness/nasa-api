// imports
const express = require('express');
const cors = require('cors');
const planetsRouter = require('./routes/planets/planets.router');

// init
const app = express();

// app usage
app.use(cors({
     //enable cors ONLY for ip
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(planetsRouter);

module.exports = app;