require("dotenv").config()
const app = require("../ai-roadmap/Backend/src/app")
const connectToDB = require("../ai-roadmap/Backend/src/config/database")

module.exports = async (req, res) => {
    try {
        await connectToDB()
    } catch (err) {
        console.error("Database connection failure in serverless function:", err.message)
    }
    return app(req, res)
}
