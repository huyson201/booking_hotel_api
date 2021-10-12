'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HotelService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HotelService.init({
    hotel_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    service_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'HotelService',
    tableName: 'hotel_service'
  });
  return HotelService;
};