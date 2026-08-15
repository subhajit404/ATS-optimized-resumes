const mongoose = require("mongoose")

async function connectToDB() {
    if (mongoose.connection.readyState >= 1) {
        return
    }
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database successfully")
    }
    catch (err) {
        console.error("Database connection error:", err.message)
        throw err
    }
}

module.exports = connectToDB