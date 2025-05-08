const express = require("express");
const {
  getAll,
  request,
  get,
  deleteFriend,
} = require("../controllers/FriendController");

const FriendRouter = express.Router();

FriendRouter.get("/", getAll);
FriendRouter.post("/request", request);
FriendRouter.delete("/delete/:roomId", deleteFriend);
FriendRouter.get("/:email", get);

module.exports = FriendRouter;
