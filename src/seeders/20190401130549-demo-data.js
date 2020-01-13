const { getRoles, getUsers, getArticles, getRoleUser } = require('../__mock__');

module.exports = {
  // eslint-disable-next-line
  up: async (queryInterface, Sequelize) => {
    // seed roles
    const roles = await queryInterface.bulkInsert('Roles', getRoles(), {
      returning: true,
    });

    // seed users
    const users = await queryInterface.bulkInsert('Users', getUsers(), {
      returning: true,
    });

    // seed articles
    await queryInterface.bulkInsert('Articles', getArticles(users));

    // seeder role-user
    return queryInterface.bulkInsert('RoleUser', getRoleUser(roles, users));
  },

  // eslint-disable-next-line
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RoleUser', null, {});
    await queryInterface.bulkDelete('Articles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
