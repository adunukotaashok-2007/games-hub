const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

app.use(express.static("."));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const rooms = new Map();

function createRoomCode() {
  return Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();
}

wss.on("connection", socket => {

  socket.on("message", raw => {

    let message;

    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }

    if (message.type === "create") {

      const room = createRoomCode();

      rooms.set(room, {
        players: [socket]
      });

      socket.room = room;
      socket.send(JSON.stringify({
        type: "roomCreated",
        room
      }));

      return;
    }

    if (message.type === "join") {

      const room = rooms.get(message.room);

      if (!room) {
        socket.send(JSON.stringify({
          type: "error",
          message: "Room not found"
        }));

        return;
      }

      if (room.players.length >= 2) {
        socket.send(JSON.stringify({
          type: "error",
          message: "Room is full"
        }));

        return;
      }

      room.players.push(socket);
      socket.room = message.room;

      room.players.forEach(player => {
        player.send(JSON.stringify({
          type: "playerJoined"
        }));
      });

      return;
    }

    if (message.type === "gameState") {

      const room = rooms.get(socket.room);

      if (!room) return;

      room.players.forEach(player => {

        if (
          player !== socket &&
          player.readyState === WebSocket.OPEN
        ) {
          player.send(JSON.stringify({
            type: "gameState",
            state: message.state
          }));
        }

      });
    }
  });

  socket.on("close", () => {

    const room = rooms.get(socket.room);

    if (!room) return;

    room.players =
      room.players.filter(p => p !== socket);

    if (room.players.length === 0) {
      rooms.delete(socket.room);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
});
