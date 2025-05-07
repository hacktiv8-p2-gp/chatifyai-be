const { Friend } = require("../models");
const { Op } = require("sequelize");
const { admin } = require("../middlewares/AuthMiddleware");
const bcrypt = require("bcryptjs");
class FriendController {
  static async getAll(req, res, next) {
    try {
      const { uid } = req.user;

      const friends = await Friend.findAll({
        where: {
          [Op.or]: [{ uid }, { friendUId: uid }],
        },
        attributes: ["roomId", "uid", "friendUId", "createdAt"],
      });

      const mappedFriends = await Promise.all(
        friends.map(async (friend) => {
          const friendUid = friend.uid === uid ? friend.friendUId : friend.uid;

          // Get friend's Firebase user data
          const friendData = await admin.auth().getUser(friendUid);

          return {
            roomId: friend.roomId,
            friend: {
              friendId: friendUid,
              email: friendData.email,
            },

            since: friend.createdAt,
          };
        })
      );

      res.status(200).json({
        data: mappedFriends,
      });
    } catch (e) {
      next(e);
    }
  }

  static async findUserByEmail(email) {
    return await admin.auth().getUserByEmail(email);
  }

  static async request(req, res, next) {
    try {
      const { uid, email } = req.user;
      const { friendEmail } = req.body;

      if (email === friendEmail) {
        throw new ResponseError("Cannot add yourself as friend", 400);
      }

      const userRecord = await this.findUserByEmail();
      const friendUid = userRecord.uid;

      const existingFriend = await Friend.findOne({
        where: {
          [Op.or]: [
            { uid, friendUId: friendUid },
            { uid: friendUid, friendUId: uid },
          ],
        },
      });

      if (existingFriend) {
        throw new ResponseError("Friendship already exists", 400);
      }

      const roomId = nanoid();

      const friend = await Friend.create({
        uid,
        friendUId: friendUid,
        roomId,
      });

      res.status(201).json({
        message: "Friend request sent successfully",
        data: {
          roomId: friend.roomId,
          friend: {
            friendId: friendUid,
            email: friendEmail,
          },
        },
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = FriendController;
