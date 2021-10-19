'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Room, Invoice, HotelStaff }) {
      // define association here
      this.hasMany(Room, { as: 'rooms', foreignKey: "hotel_id" })
      this.hasMany(Invoice, { as: 'invoices', foreignKey: "hotel_id" })
      this.hasMany(HotelStaff, { as: 'staffs', foreignKey: 'hotel_id' })
    }
  };
  Hotel.init({
    hotel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_uuid: DataTypes.STRING,
    hotel_name: DataTypes.STRING,
    hotel_address: DataTypes.STRING,
    hotel_star: DataTypes.INTEGER,
    hotel_phone: DataTypes.STRING,
    hotel_desc: DataTypes.STRING,
    hotel_img: DataTypes.TEXT,
    hotel_slide: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Hotel',
    tableName: "hotels"
  });
  return Hotel;
};