'use strict';
const bcrypt = require('bcrypt');
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Invoice }) {
      // define association here
      this.hasMany(Invoice, { as: "invoices", foreignKey: "user_uuid" })
    }
    toJSON() {
      return { ...this.get(), user_password: undefined, remember_token: undefined }
    }
  };
  User.init({
    user_uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING,
      unique: true
    },
    user_img: {
      type: DataTypes.TEXT
    },
    user_password: {
      type: DataTypes.STRING,
      set(value) {
        let hash = bcrypt.hashSync(value, 10)
        this.setDataValue('user_password', hash)
      }
    },
    user_name: DataTypes.STRING,
    user_phone: DataTypes.STRING,
    user_role: DataTypes.INTEGER,
    remember_token: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};