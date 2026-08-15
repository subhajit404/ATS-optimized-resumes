const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        ]
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* Root and health check routes */
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Interview AI Workspace Backend is running",
        timestamp: new Date().toISOString()
    })
})

app.get("/health", (req, res) => {
    res.json({ status: "healthy" })
})

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* Global error handler */
app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err)
    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    })
})

module.exports = app