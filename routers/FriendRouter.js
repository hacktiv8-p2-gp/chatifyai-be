const express = require("express");
const { getAll, request, get } = require("../controllers/FriendController");

const FriendRouter = express.Router();

FriendRouter.get("/", getAll);
FriendRouter.get("/:email", get);
FriendRouter.post("/request", request);

module.exports = FriendRouter;
