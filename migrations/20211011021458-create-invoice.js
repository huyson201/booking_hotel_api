'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invoices', {
      invoice_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.STRING
      },
      hotel_id: {
        type: Sequelize.INTEGER
      },
      user_uuid: {
        type: Sequelize.STRING
      },
      r_date: {
        type: Sequelize.DATE
      },
      p_date: {
        type: Sequelize.DATE
      },
      room_id: {
        type: Sequelize.INTEGER
      },
      room_quantity: {
        type: Sequelize.INTEGER
      },
      status: {
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
    await queryInterface.dropTable('invoices');
  }
};