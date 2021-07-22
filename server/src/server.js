// imports
const { Console } = require('console');
const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
const {loadPlanetsData} = require('./models/planets.model')

const MONGO_URL = 'mongodb+srv://nasa-api:uGPilqB29OkTU2OQ@nasacluster.z8yfn.mongodb.net/nasa?retryWrites=true&w=majority'
// initialization
const PORT = process.env.PORT || 8000; // lets us plug in a port or defaults to 8000


// server creation
const server = http.createServer(app); //plugs in express app

// mongoose on start
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
// mongoose error
mongoose.connection.on('error', (err) => {
    console.log(err);
})
// to fix await load is use in an async function then listen
async function startServer() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
    await loadPlanetsData(); // wait for data to load


    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    });
}

startServer();