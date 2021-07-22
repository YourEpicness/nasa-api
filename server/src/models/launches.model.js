const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;
const launches = new Map();



const launch = {
    flightNumber: 100,
    mission: 'Kepler ExX',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27 2021'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};


launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId) {
    // return await launchesDatabase.has(launchId);
    return await launchesDatabase.findOne({
        flightNumber: launchId,
    })
}

// to autoincrement
async function getLatestFlightNumber() {
    // use - to sort by highest to lowest
    const latestLaunch = await launchesDatabase.findOne({}).sort('-flightNumber');
    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber;
}

// when getting elements use .find()
async function getAllLaunches() {
    return await launchesDatabase
    .find({}, {'_id':0, '__v':0});
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     // setting default field values
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         success: true,
//         upcoming: true,
//         customers: ['Zero To Mastery', 'NASA'],
//         flightNumber: latestFlightNumber,
//     }));
// }

async function saveLaunch(launch) {
    try {
        const planet = await planets.findOne({
            keplerName: launch.target,
        });

        if(!planet) {
            throw new Error('No matching planet found.');
        }
        await launchesDatabase.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true,
        })
    } catch(err) {
        console.log(`Error: ${err}`)
    }
    
}

async function abortLaunchById(launchId) {
    // launches.delete(launchId);
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
    const aborted =  await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        success: false,
        upcoming: false
    });

    // ??? confirms that its aborted and 1 was modified
    return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    abortLaunchById,
    scheduleNewLaunch
}