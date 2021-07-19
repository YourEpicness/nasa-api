const {getAllLaunches, addNewLaunch} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    // Array.from look it up
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    // turning launchDate into a date object no matter the input
    launch.launchDate = new Date(launch.launchDate);

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
};