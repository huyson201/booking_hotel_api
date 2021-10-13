'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rooms', {
      room_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hotel_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      room_name: {
        type: Sequelize.STRING
      },
      room_price: {
        type: Sequelize.STRING
      },
      room_desc: {
        type: Sequelize.STRING
      },
      room_beds: {
        type: Sequelize.INTEGER
      },
      room_area: {
        type: Sequelize.STRING
      },
      room_quantity: {
        type: Sequelize.INTEGER
      },
      room_num_people: {
        type: Sequelize.INTEGER
      },
      room_services: {
        type: Sequelize.STRING
      },
      room_surcharge: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('rooms');
  }
};