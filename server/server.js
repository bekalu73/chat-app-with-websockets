const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Message = require("./models/Message");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

//connect to DB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Load existing messages
  Message.find().then((messages) => {
    socket.emit("loadMessages", messages);
  });

  // Handle new messages
  socket.on("sendMessage", (data) => {
    const newMessage = new Message(data);
    newMessage.save().then(() => {
      io.emit("message", data);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
