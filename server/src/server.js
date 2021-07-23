// imports
const { Console } = require('console');
const app = require('./app');
const http = require('http');

const {mongoConnect} = require('./services/mongo')

const {loadPlanetsData} = require('./models/planets.model')
const {loadLaunchData} = require('./models/launches.model')
const MONGO_URL = 'mongodb+srv://nasa-api:uGPilqB29OkTU2OQ@nasacluster.z8yfn.mongodb.net/nasa?retryWrites=true&w=majority'
// initialization
const PORT = process.env.PORT || 8000; // lets us plug in a port or defaults to 8000


// server creation
const server = http.createServer(app); //plugs in express app


// to fix await load is use in an async function then listen
async function startServer() {
    await mongoConnect();
    await loadPlanetsData(); // wait for data to load
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    });
}

startServer();