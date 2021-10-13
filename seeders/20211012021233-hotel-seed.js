'use strict';
const faker = require('faker')


module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = []
    for (let i = 0; i < 20; i++) {
      data.push({
        user_uuid: faker.datatype.uuid(),
        hotel_name: "Cap Hotel " + (i + 1),
        hotel_desc: "Hotel desc...",
        hotel_address: faker.address.cityName(),
        hotel_star: faker.datatype.number(4) + 1,
        hotel_phone: faker.phone.phoneNumber(),
        hotel_img: "d0b17f61d53f49da9813dfb973328b55",
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('hotels', data, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hotels', null, {});
  }
};
