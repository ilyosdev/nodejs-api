module.exports = {
  // eslint-disable-next-line
  up: async (queryInterface, Sequelize) => {
    // associate user-role
    await queryInterface.createTable('RoleUser', {
      UserId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      RoleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    // associate article-user
    return queryInterface.addColumn('Articles', 'ownerId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  },

  // eslint-disable-next-line
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Articles', 'ownerId');
    return queryInterface.dropTable('RoleUser');
  },
};
