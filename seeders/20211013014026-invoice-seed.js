'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = []
    for (let i = 0; i < 20; i++) {
      let date = faker.datatype.datetime()
      date.setHours(12, 00, 00)
      let nDate = new Date(date)
      nDate.setDate(date.getDate() + 1)

      data.push({
        price: (faker.datatype.number(5) + 1) * 50000,
        hotel_id: faker.datatype.number(19) + 1,
        room_id: faker.datatype.number(19) + 1,
        user_uuid: faker.datatype.uuid(),
        r_date: date,
        p_date: nDate,
        room_quantity: faker.datatype.number(2) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    await queryInterface.bulkInsert('invoices', data, {});

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('invoices', null, {});

  }
};
