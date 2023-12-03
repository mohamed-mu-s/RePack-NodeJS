const mongoose = require('mongoose');

const dbOpts = {
    connectTimeoutMS: 180000
}
const connectDB = () => mongoose.connect(`${process.env.MONGODB_URI}`, dbOpts).catch(err => console.error(err))

const connect = mongoose.connection;

connect.on("connected", () => { console.log('DB connected') });
connect.on("disconnected", () => { console.log('DB disconnected') });
connect.on("error", (err) => { console.log(`DB error ${err}`) });

module.exports = connectDB;