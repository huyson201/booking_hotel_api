'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = []
    for (let i = 0; i < 20; i++) {
      data.push({
        room_name: "room " + faker.name.title(),
        hotel_id: faker.datatype.number(19) + 1,
        room_price: 50000 * (faker.datatype.number(4) + 1),
        room_beds: faker.datatype.number(1) + 1,
        room_desc: "desc...",
        room_area: "20x20",
        room_quantity: faker.datatype.number(5) + 1,
        room_num_people: faker.datatype.number(5) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('rooms', data, {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('rooms', null, {});

  }
};
