const {getAllPlanets} = require('../../models/planets.model')

// gets all planets...
function httpGetAllPlanets(req, res) {
    // better to use return once done
    return res.status(200).json(getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,
}