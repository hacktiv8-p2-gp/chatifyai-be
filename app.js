if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = 3000;
const cors = require("cors");
const errorHandler = require("./middlewares/ErrorMiddleware");
const FriendRouter = require("./routers/FriendRouter");
const ConversationRouter = require("./routers/ConversationRouter");
const { AuthMiddleware } = require("./middlewares/AuthMiddleware");
const { Op } = require("sequelize");
const {
  createMessage,
  getUserCanAccessRoom,
} = require("./controllers/ConversationController");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("io", io);

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new Error("Token invalid");
    }

    const payload = await admin.auth().verifyIdToken(token);

    socket.user = payload;

    next();
  } catch (e) {
    next(new Error("Token invalid"));
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", async (roomId) => {
    try {
      const canAccess = await getUserCanAccessRoom();
      if (!canAccess) {
        throw new Error("Access denied to this room");
      }

      socket.join(roomId);
    } catch (e) {
      socket.emit("error", e.message || "Internal Server Error");
    }
  });

  socket.on("send-message", async ({ roomId, message }) => {
    try {
      const messageData = await createMessage(roomId, message, socket.user.uid);

      io.to(roomId).emit("receive-message", messageData);
    } catch (error) {
      socket.emit("error", e.message || "Internal Server Error");
    }
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
  });
});

app.use(AuthMiddleware);
app.use("/api/friends", FriendRouter);
app.use("/api/conversations", ConversationRouter);

app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server with Socket.IO listening on port ${port}`);
});
