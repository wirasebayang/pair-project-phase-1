'use strict';
const fs = require('fs').promises
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/users.json', 'utf-8')).map(el => {
      delete el.id
      el.password = bcrypt.hashSync(el.password, 10)
      el.createdAt = new Date()
      el.updatedAt = new Date()
      return el
    })

    await queryInterface.bulkInsert('Users', data)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
