const fs = require('fs');
const parse = require('csv-parse');
const path = require('path');


const habitablePlanets = [];

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
        .on('data', (data) => {
            if(isHabitablePlanet(data)) {
                habitablePlanets.push(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err); // on error
        })
        .on('end', () => {
            console.log(`${habitablePlanets.length} planets found!`);
            resolve(); // finish when promise resolved 
        });
    });
}



module.exports = {
    loadPlanetsData,
    planets: habitablePlanets,
};