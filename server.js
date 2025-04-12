const express = require("express");
require("dotenv").config();
const cors = require("cors");
const initRoutes = require("./routes");
const dbConnected = require("./configs/dbConnected");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
initRoutes(app);
dbConnected();

app.listen(port, () => console.log(`server on port: ${port}`));
