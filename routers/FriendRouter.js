const express = require("express");
const { getAll, request, get } = require("../controllers/FriendController");

const FriendRouter = express.Router();

FriendRouter.get("/", getAll);
FriendRouter.post("/request", request);
FriendRouter.get("/:email", get);

module.exports = FriendRouter;
