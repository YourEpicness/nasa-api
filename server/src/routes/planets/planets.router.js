// imports
const express = require('express');
const {
    httpGetAllPlanets
} = require('./planets.controller')
// init for router
const planetsRouter = express.Router();

// GET (route, function)
planetsRouter.get('/', httpGetAllPlanets);

// exports
module.exports = planetsRouter;