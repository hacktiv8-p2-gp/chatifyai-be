"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    static associate(models) {
      Friend.hasMany(models.Conversation, {
        foreignKey: "roomId",
        sourceKey: "roomId",
      });
    }
  }
  Friend.init(
    {
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      friendUId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Friend",
    }
  );
  return Friend;
};
