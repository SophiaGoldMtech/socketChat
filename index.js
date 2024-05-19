const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.static("public"));

let users = []; // Define the users array globally

io.on("connection", (socket) => {
  console.log("USER CONNECTED");

  socket.on("user joined", (username) => {
    socket.username = username;
    console.log(socket.username);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      users = users.filter((user) => user !== socket.username);
      io.emit("user left", socket.username);
      io.emit("update user list", users);
    }
    console.log("USER DISCONNECTED");
  });

  socket.on("set username", (name) => {
    socket.username = name;
    users.push(name);
    io.emit("user joined", name);
    io.emit("update user list", users);
    console.log(`Username set to: ${name}`);
  });

  socket.on("chat message", (msg) => {
    if (socket.username) {
      console.log(`${socket.username}: ${msg}`);
      io.emit("server message", { name: socket.username, msg: msg });
    } else {
      console.log("No username set for this socket");
    }
  });
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
