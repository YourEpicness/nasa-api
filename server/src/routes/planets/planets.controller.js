const {getAllPlanets} = require('../../models/planets.model')

// gets all planets...
async function httpGetAllPlanets(req, res) {
    // better to use return once done
    return res.status(200).json(await getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,
}