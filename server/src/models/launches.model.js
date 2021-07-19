const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler ExX',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27th, 2030'),
    destination: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    // setting default field values
    launches.set(launch.flightnumber, Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero To Mastery', 'NASA'],
        flightNumber: latestFlightNumber,
    }));
}

module.exports = {
    launches,
    getAllLaunches,
    addNewLaunch
}