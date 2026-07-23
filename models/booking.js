'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'StudentId', as: 'Student' });
      Booking.belongsTo(models.TutoringService, { foreignKey: 'ServiceId', as: 'Service' });
    }

    canBeCancelled() {
      return ['pending', 'confirmed'].includes(this.status);
    }
  }
  Booking.init({
    // PK eksplisit: tanpa ini, belongsToMany({ through: 'Booking' }) di User &
    // TutoringService menghapus id auto-generated dan menjadikan
    // [StudentId, ServiceId] composite PK, sehingga el.id di view = undefined
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bookingDate: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['pending', 'confirmed', 'completed', 'cancelled']],
          msg: `Status booking tidak valid!`
        }
      }
    },
    StudentId: DataTypes.INTEGER,
    ServiceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};