import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import opportunitiesRoute from "./routes/opportunities.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const generalLimiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too Many Requests, Please Try Again",
        data: []
    }
});

app.use(generalLimiter);
app.get("/", (req, res) => {
    res.json({message: "Welcome To Research Opportunity Portal API"});
});
app.use("/api/opportunities", opportunitiesRoute);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});
app.use(errorHandler);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Listening at port : ${port}`);
});