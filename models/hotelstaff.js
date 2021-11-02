'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HotelStaff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Hotel }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'user_uuid', as: 'staff_info' })
      this.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' })
    }
  };
  HotelStaff.init({
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_uuid: DataTypes.STRING,
    hotel_id: DataTypes.INTEGER,
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HotelStaff',
    tableName: 'hotel_staffs'
  });
  return HotelStaff;
};