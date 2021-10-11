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
    static associate(models) {
      // define association here
    }
  };
  Room.init({
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    room_name: DataTypes.STRING,
    room_price: DataTypes.STRING,
    room_desc: DataTypes.STRING,
    room_beds: DataTypes.INTEGER,
    room_services: DataTypes.STRING,
    room_surcharge: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
    tableName: "rooms"
  });
  return Room;
};