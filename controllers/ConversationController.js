const { Conversation, Friend } = require("../models");
const ResponseError = require("../helpers/ResponseError");

class ConversationController {
  static async getByRoomId(req, res, next) {
    try {
      const { roomId } = req.params;
      const { uid } = req.user;

      const friend = await Friend.findOne({
        where: {
          roomId,
          [Op.or]: [{ uid }, { friendUId: uid }],
        },
      });

      if (!friend) {
        throw new ResponseError("Room not found or access denied", 403);
      }

      // Get all conversations in the room
      const conversations = await Conversation.findAll({
        where: { roomId },
        order: [["createdAt", "ASC"]],
        attributes: ["id", "senderUid", "message", "createdAt"],
      });

      res.status(200).json({
        data: conversations,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getUserCanAccessRoom(roomId, uid) {
    const canAccess = await Friend.findOne({
      where: {
        roomId,
        [Op.or]: [{ uid }, { friendUId: uid }],
      },
    });

    return canAccess;
  }

  static async createMessage({ roomId, message, user }) {
    try {
      const { uid } = user;

      const friend = await Friend.findOne({
        where: {
          roomId,
          [Op.or]: [{ uid }, { friendUId: uid }],
        },
      });

      if (!friend) {
        throw new ResponseError("Room not found or access denied", 403);
      }

      const conversation = await Conversation.create({
        roomId,
        senderUid: uid,
        message,
      });

      return {
        data: {
          id: conversation.id,
          senderUid: conversation.senderUid,
          message: conversation.message,
          createdAt: conversation.createdAt,
        },
      };
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ConversationController;
