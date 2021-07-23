const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');
const DEFAULT_FLIGHT_NUMBER = 100;


async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    // return await launchesDatabase.has(launchId);
    return await findLaunch({
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
async function getAllLaunches(skip, limit) {
    return await launchesDatabase
    .find({}, {'_id':0, '__v':0})
    .sort({ flightNumber: 1}) // 1 is ascneding // -1 descending
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet) {
        throw new Error('No matching planet found.');
    }

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
      
        await launchesDatabase.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true,
        })
    } catch(err) {
        console.log(`Error: ${err}`)
    }
    
}


async function populateLaunches() {
    console.log('Downlaoding launch data..');  
    const response = await axios.post(SPACEX_API_URL, {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: "rocket",
                        select: {
                            name: 1
                        }
                    },
                    {
                        path: 'payloads',
                        select: {
                            'customers': 1
                        }
                    }
                ]
            }
    })

    if(response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed')
    } 
        
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        };

        
        //populate launches collection
        await saveLaunch(launch);
}
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'
async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if(firstLaunch) {
        console.log('Launch data already loaded');
    } else {
        await populateLaunches();
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
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    abortLaunchById,
    scheduleNewLaunch
}