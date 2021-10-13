'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Invoice.init({
    invoice_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    price: DataTypes.STRING,
    hotel_id: DataTypes.INTEGER,
    user_uuid: DataTypes.STRING,
    r_date: DataTypes.DATE,
    p_date: DataTypes.DATE,
    room_id: DataTypes.INTEGER,
    room_quantity: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices'
  });
  return Invoice;
};