const fs = require('fs');
const parse = require('csv-parse');
const path = require('path');

const planets = require('./planets.mongo')
// slowly refactor to using mongodb
// const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] == 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

// just some promise code review, utilizes a resolve and reject
/*
const promise = new Promise((resolve, reject) => {
    resolve(42)
});

promise.then((result) => {
    
});
*/

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))

        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('data', async (data) => {
            if(isHabitablePlanet(data)) {
                // insert + update = upsert
                savePlanet(data);
            } 
        })
        .on('error', (err) => {
            console.log(err);
            reject(err); // on error
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} planets found!`);
            resolve(); // finish when promise resolved 
        });
    });
}

async function getAllPlanets() {
    // mongoose.find is powerful and useful
    return await planets.find({});
}

async function savePlanet(planet) {
    try {
        await planets.updateOne( {
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true
        })
    } catch(err) {
        console.error(`Could not save planet ${err}`)  
    }
 
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
};