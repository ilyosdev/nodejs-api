module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING,
    permissions: DataTypes.ARRAY(DataTypes.TEXT),
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      as: 'users',
      through: 'RoleUser',
    });
  };

  return Role;
};
