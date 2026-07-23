'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bookingDate: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      StudentId: {
        type: Sequelize.INTEGER,
        references: {
        model: 'Users',
        key: 'id'
      }, 
      onUpdate: 'cascade',
      onDelete: 'cascade'
      },
      ServiceId: {
        type: Sequelize.INTEGER,
        references: {
        model: 'TutoringServices',
        key: 'id'
      }, 
      onUpdate: 'cascade',
      onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};