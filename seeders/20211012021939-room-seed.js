'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('rooms', [{
      room_name: "room 1",
      hotel_id: 1,
      room_price: "200000",
      room_beds: 2,
      room_desc: "desc...",
      room_area: "20x20",
      room_num_people: 4,

    }, {
      room_name: "room 2",
      hotel_id: 1,
      room_price: "200000",
      room_beds: 2,
      room_desc: "desc...",
      room_area: "20x20",
      room_num_people: 4,
      room_quantity: 4
    }], {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('rooms', null, {});

  }
};
