// imports
const express = require('express');
const {
    getAllPlanets
} = require('./planets.controller')
// init for router
const planetsRouter = express.Router();

// GET (route, function)
planetsRouter.get('/planets', getAllPlanets);

// exports
module.exports = planetsRouter;