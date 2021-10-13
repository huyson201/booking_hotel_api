'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Invoice }) {
      // define association here
      this.hasMany(Invoice, { as: 'invoices', foreignKey: 'room_id' })
    }
    toJSON() {
      return { ...this.get() }
    }
  };
  Room.init({
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_name: {
      type: DataTypes.STRING
    },
    room_price: DataTypes.STRING,
    room_desc: DataTypes.STRING,
    room_beds: DataTypes.INTEGER,
    room_area: {
      type: DataTypes.STRING
    },
    room_quantity: {
      type: DataTypes.INTEGER
    },
    room_num_people: {
      type: DataTypes.INTEGER
    },
    room_services: DataTypes.STRING,
    room_surcharge: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
    tableName: "rooms"
  });
  return Room;
};