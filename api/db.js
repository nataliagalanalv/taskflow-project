const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'weekycheck'
    });
    isConnected = true;
};

module.exports = connectDB;