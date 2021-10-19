'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hotels', {
      hotel_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_uuid: {
        type: Sequelize.STRING
      },
      hotel_name: {
        type: Sequelize.STRING
      },
      hotel_address: {
        type: Sequelize.STRING
      },
      hotel_star: {
        type: Sequelize.INTEGER
      },
      hotel_phone: {
        type: Sequelize.STRING
      },
      hotel_desc: {
        type: Sequelize.STRING
      },
      hotel_img: {
        type: Sequelize.TEXT
      },
      hotel_slide: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hotels');
  }
};