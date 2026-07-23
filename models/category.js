'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.TutoringService, {
  foreignKey: 'CategoryId',
})
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: `Nama category sudah ada!`
      },
      validate: {
        notNull: {
          args: true,
          msg: `Nama category tidak boleh kosong!`
        },
        notEmpty: {
          args: true,
          msg: `Nama category tidak boleh kosong!`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};