const {getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
    // Array.from look it up
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if(!launch. mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        })
    } 

    // turning launchDate into a date object no matter the input
    launch.launchDate = new Date(launch.launchDate);
    // input validation checking
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    if(!existsLaunchWithId(launchId)) {
        //if launch doesnt exist
        return res.status(404).json({
            error: 'Launch not found'
    });
    }
    const aborted = abortLaunchById(launchId);
    // if launch does exist
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};