const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);

const words = require("./word");
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

function initSocketIO(server) {
  const io = new socketIO.Server(server, {
    cors: {
      origin: "*",
    },
    transports: ["websocket", "polling"],
  });

  return io;
}

function onPlayerRequestNewWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomIndex];

  return randomWord;
}

function startSocketListening(io) {
  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.onAny((event, ...args) => {
      console.log(`Received event: ${event}${args && args.length > 0 ? " , data: " + JSON.stringify(args) : ""}`);
      let response;

      if (event === "newWordRequest") {
        const randomWord = onPlayerRequestNewWord();
        response = randomWord;
        socket.emit("newWord", response);
      }

      console.log(`Response event: ${event}${response ? ", response: " + JSON.stringify(response) : ""}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

function listenAPI() {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // app.get("/api/nui-test", (_req, res) => {
  //   res.sendStatus(200);
  // });
}

async function main() {
  io = initSocketIO(server);
  startSocketListening(io);
  listenAPI();
}

main();
