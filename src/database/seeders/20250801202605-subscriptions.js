'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subscriptions', [
      {
        id: uuidv4(),
        email: 'jbniyikiza@gmail.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'jbniyikiza20@gmail.com',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
     
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:*/
     await queryInterface.bulkDelete('subscriptions', {}, {});
     
  }
};

