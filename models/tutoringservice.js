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

    get formattedPrice() {
      return `Rp ${Number(this.price).toLocaleString('id-ID')}`;
    }
  }
  TutoringService.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Nama service tidak boleh kosong!`
        },
        notEmpty: {
          args: true,
          msg: `Nama service tidak boleh kosong!`
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Description tidak boleh kosong!`
        },
        notEmpty: {
          args: true,
          msg: `Description tidak boleh kosong!`
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Price tidak boleh kosong!`
        },
        isInt: {
          args: true,
          msg: `Price harus berupa angka bulat (rupiah)!`
        },
        min: {
          args: [0],
          msg: `Price tidak boleh negatif!`
        }
      }
    },
    imageUrl: DataTypes.TEXT,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Category wajib dipilih!`
        },
        isInt: {
          args: true,
          msg: `Category wajib dipilih!`
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TutoringService',
  });
  return TutoringService;
};