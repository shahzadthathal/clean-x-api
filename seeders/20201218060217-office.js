'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
    */
      //Retrieve later from towers table
      //let towerId = 2;
      await queryInterface.bulkInsert('Offices', [{
        office_number: '1105 A',
        rent: 50000,
        towerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Offices', null, {});
     
  }
};
