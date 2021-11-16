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
    static associate({ Service }) {
      // define association here
      this.belongsTo(Service, { foreignKey: 'service_id', as: 'service' })
    }
  };
  HotelService.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER

    },
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