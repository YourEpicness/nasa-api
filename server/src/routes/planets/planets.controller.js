const planets = require('../../models/planets.model')

// gets all planets...
function getAllPlanets(req, res) {
    // better to use return once done
    return res.status(200).json(planets);
}

module.exports = {
    getAllPlanets,
}