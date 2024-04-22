const bodyParser = require("body-parser");
const express = require("express");
// require('./routes/api/redis/redisClient');  // Ensures Redis client starts
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");
const WebSocket = require("ws");

const { handleConnection: characterTokenWebSocketHandler } = require("./websocket/characterTokenWebSocket");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", characterTokenWebSocketHandler);

const PORT = process.env.PORT || 4002;
const app = express();

const scene = require("./routes/api/controllers/sceneController");
const character = require("./routes/api/controllers/characterController");
const prop = require("./routes/api/controllers/propController");
const characterToken = require("./routes/api/controllers/characterTokenController");

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000", // replace with your application's URL
    credentials: true, // IMPORTANT: enable credentials. This is needed for cookies to work
  })
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(helmet());
connectDB();

app.use("/api/v1/map/scene", scene);
app.use("/api/v1/map/character", character);
app.use("/api/v1/map/prop", prop);
app.use("/api/v1/map/character_token", characterToken);

const server = app.listen(PORT, console.log(`API is listening on port ${PORT}`));
server.timeout = 2000000; // 15 minute time out max
