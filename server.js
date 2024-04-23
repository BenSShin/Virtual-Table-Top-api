const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
// require('./routes/api/redis/redisClient');  // Ensures Redis client starts
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");
const { WebSocketServer, WebSocket } = require("ws");

// const { handleConnection: characterTokenWebSocketHandler } = require("./websocket/characterTokenWebsocket");

const PORT = process.env.PORT || 4002;
const app = express();

// Error when http server is handling
function onSocketPreError(e) {
  console.log(e);
}
// Error when websocket server is handling
function onSocketPostError(e) {
  console.log(e);
}

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

const s = app.listen(PORT, console.log(`API is listening on port ${PORT}`));
s.timeout = 2000000; // 15 minute time out max

const wss = new WebSocketServer({ noServer: true });

s.on("upgrade", (req, socket, head) => {
  socket.on("error", onSocketPreError);

  // perform auth, limited to cookie auth in this case
  if (!!req.headers["BadAuth"]) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socket.removeListener("error", onSocketPreError);
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws, req) => {
  ws.on("error", onSocketPostError);

  ws.on("message", (msg, isBinary) => {
    wss.clients.forEach((client) => {
      // < ws !== client && > add this if you want exlude client sending message.
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    console.log("Cnnection Closed");
  });
});

// wss.on("connection", function connection(ws) {
//   console.log("new connection");
//   ws.send("Welcome New Client!");

//   ws.on("message", function incoming(message) {
//     console.log("recieved %s", message);

//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
// });

// app.get("/", (req, res) => res.send("Hello World!"));
