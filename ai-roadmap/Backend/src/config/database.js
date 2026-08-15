const mongoose = require("mongoose")

let isConnected = false

async function connectToDB() {
    if (mongoose.connection.readyState === 1 || isConnected) {
        return
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables.")
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        })
        isConnected = true
        console.log("Connected to Database successfully")
    }
    catch (err) {
        console.error("Database connection error:", err.message)
        isConnected = false
        throw err
    }
}

module.exports = connectToDB