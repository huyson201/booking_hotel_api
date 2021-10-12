'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('hotels', [{
      user_uuid: "0as5d7as5dqw5",
      hotel_name: "Cap Hotel 1",
      hotel_desc: "Hotel desc...",
      hotel_address: "ninh hải, ninh thuận",
      hotel_star: 3,
      hotel_phone: "03654784587",
      hotel_img: "d0b17f61d53f49da9813dfb973328b55",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hotels', null, {});
  }
};
