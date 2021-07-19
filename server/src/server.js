// imports
const { Console } = require('console');
const app = require('./app');
const http = require('http');

// initialization
const PORT = process.env.PORT || 8000; // lets us plug in a port or defaults to 8000


// server creation
const server = http.createServer(app); //plugs in express app


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
});