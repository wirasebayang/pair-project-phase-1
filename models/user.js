'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      User.hasMany(models.TutoringService, {
        foreignKey: 'UserId',
      });

      User.belongsToMany(models.TutoringService, { through: 'Booking', foreignKey: 'StudentId', as: 'BookedServices' });
    }

    get displayName() {
      return this.UserProfile ? this.UserProfile.fullname : this.username;
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Username tidak boleh kosong!`
        },
        notEmpty: {
          args: true,
          msg: `Username tidak boleh kosong!`
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: `Email sudah terdaftar!`
      },
      validate: {
        notNull: {
          args: true,
          msg: `Email tidak boleh kosong!`
        },
        notEmpty: {
          args: true,
          msg: `Email tidak boleh kosong!`
        },
        isEmail: {
          args: true,
          msg: `Format email tidak valid!`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Password tidak boleh kosong!`
        },
        notEmpty: {
          args: true,
          msg: `Password tidak boleh kosong!`
        },
        len: {
          args: [6, 100],
          msg: `Password minimal 6 karakter!`
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Role tidak boleh kosong!`
        },
        notEmpty: {
          args: true,
          msg: `Role tidak boleh kosong!`
        },
        isIn: {
          args: [['tutor', 'student', 'admin']],
          msg: `Role harus tutor, student, atau admin!`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });
  return User;
};