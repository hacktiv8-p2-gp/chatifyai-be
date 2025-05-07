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
      const canAccess = await Friend.findOne({
        where: {
          roomId,
          [Op.or]: [{ uid: socket.user.uid }, { friendUId: socket.user.uid }],
        },
      });

      if (!canAccess) {
        socket.emit("error", "Access denied to this room");
        return;
      }

      socket.join(roomId);
    } catch (error) {
      socket.emit("error", "Failed to join room");
    }
  });

  socket.on("send-message", async ({ roomId, messasge }) => {
    try {
      const messageData = await createMessage(roomId, message, socket.user.uid);

      io.to(roomId).emit("receive-message", messageData);
    } catch (error) {
      socket.emit("error", "Failed to send message");
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
