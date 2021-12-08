'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { as: 'user_info', foreignKey: 'user_uuid' })
    }

  };
  Rate.init({
    user_uuid: DataTypes.STRING,
    rate_star: DataTypes.INTEGER,
    rate_comment: DataTypes.STRING,
    hotel_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rate',
    tableName: 'rates'
  });
  return Rate;
};