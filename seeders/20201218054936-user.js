'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
    */
      await queryInterface.bulkInsert('Users', [{
        full_name: 'CleanX',
        email: 'user@app.com',
        password: '$2a$08$o.mQynZmyJvBtK9tTlLpl.NHZBa4/yQ9YN4hy59n0uDGRWShsc2kO', //bcrypt.hashSync(req.body.password || 123456, 8)
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
    await queryInterface.bulkDelete('Users', null, {});
     
  }
};
