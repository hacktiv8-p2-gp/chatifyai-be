const express = require("express");
const {
  getByRoomId,
  analysisMessage,
} = require("../controllers/ConversationController");

const ConversationRouter = express.Router();

ConversationRouter.post("/analyze-chat", analysisMessage);
ConversationRouter.get("/:roomId", getByRoomId);

module.exports = ConversationRouter;
