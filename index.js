import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import expressListEndpoints from "express-list-endpoints";
import { testConnection } from "./database/db.js";
import router from "./routes/index.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use(router);


app.get("/", (req, res) => {
    res.send("Hello Murtherfucker!");
});

app.use("/endpoints", (req, res) => {
    res.json(expressListEndpoints(app));
})

app.listen(process.env.APP_PORT || 3000, () => {
    testConnection();
    console.log(`http://localhost:${process.env.APP_PORT || 3000}`);
});