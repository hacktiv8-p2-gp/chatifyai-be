const express = require("express");
const { getByRoomId } = require("../controllers/ConversationController");

const ConversationRouter = express.Router();

ConversationRouter.get("/:roomId", getByRoomId);

module.exports = ConversationRouter;
