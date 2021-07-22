const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:uGPilqB29OkTU2OQ@nasacluster.z8yfn.mongodb.net/nasa?retryWrites=true&w=majority'

// mongoose on start
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});
// mongoose error
mongoose.connection.on('error', (err) => {
    console.log(err);
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}