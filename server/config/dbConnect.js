const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();


const dbConnect = async() => {
    try {
        const url = process.env.MONGODB_URL;

        await mongoose.connect(url);

        console.log("Database connect successfully");
    } catch (error) {
        console.log(error)
        console.log("Failed to connect to database")
    }
}

module.exports = dbConnect;