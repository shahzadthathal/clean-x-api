'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
    */
      await queryInterface.bulkInsert('Towers', [{
        name: 'HDS Tower',
        location: 'HDS Tower - Cluster F - Jumeirah Lakes Towers - Dubai',
        number_of_floors: 42,
        number_of_offices: 1200,
        rating: 4.5,
        latitude:25.0722,
        longitude:55.1424,
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
    await queryInterface.bulkDelete('Towers', null, {});
     
  }
};
