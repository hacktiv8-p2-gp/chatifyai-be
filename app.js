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
const FriendRouter = require("./routers/FriendRouter");
const ConversationRouter = require("./routers/ConversationRouter");
const { AuthMiddleware, admin } = require("./middlewares/AuthMiddleware");
const {
  createMessage,
  getUserCanAccessRoom,
} = require("./controllers/ConversationController");
const ErrorMiddleware = require("./middlewares/ErrorMiddleware");
const ResponseError = require("./helpers/ResponseError");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("io", io);

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token || typeof token !== "string") {
      throw new ResponseError("Invalid token format", 401);
    }

    let payload;
    try {
      payload = await admin.auth().verifyIdToken(token);
    } catch (e) {
      throw new ResponseError("Token invalid", 401);
    }

    socket.user = payload;

    next();
  } catch (e) {
    next(e);
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", async (roomId) => {
    try {
      const canAccess = await getUserCanAccessRoom(roomId, socket.user.uid);
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
      const user = socket.user;
      const messageData = await createMessage({ roomId, message, user });

      io.to(roomId).emit("receive-message", messageData);
    } catch (error) {
      socket.emit("error", error.message || "Internal Server Error");
    }
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
  });
});

app.use(AuthMiddleware);
app.use("/api/friends", FriendRouter);
app.use("/api/conversations", ConversationRouter);

app.use(ErrorMiddleware);

server.listen(port, () => {
  console.log(`Server with Socket.IO listening on port ${port}`);
});
