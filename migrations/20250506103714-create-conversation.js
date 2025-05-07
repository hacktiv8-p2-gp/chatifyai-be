/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Conversations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER, // Changed from STRING to INTEGER
      },
      roomId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Friends",
          key: "roomId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      senderUid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add index for roomId for better query performance
    await queryInterface.addIndex("Conversations", ["roomId"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Conversations");
  },
};
