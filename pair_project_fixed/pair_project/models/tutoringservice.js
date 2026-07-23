'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutoringService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TutoringService.belongsTo(models.Category, {
  foreignKey: 'CategoryId',
});

TutoringService.belongsTo(models.User, {
  foreignKey: 'UserId',
});

TutoringService.belongsToMany(models.User, { through: 'Booking' , foreignKey : 'ServiceId', as: 'Students' });
    }
  }
  TutoringService.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    imageUrl: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TutoringService',
  });
  return TutoringService;
};