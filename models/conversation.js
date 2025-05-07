"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      // Define association with Friend model
      Conversation.belongsTo(models.Friend, {
        foreignKey: "roomId",
        targetKey: "roomId",
      });
    }
  }
  Conversation.init(
    {
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderUid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
