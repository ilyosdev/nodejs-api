const { authorize } = require('../../lib');
const { getAppPolicies } = require('../utils');

const policies = getAppPolicies();

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      as: 'roles',
      through: 'RoleUser',
    });
  };

  User.prototype.getPermissions = async function f() {
    const roles = await this.getRoles();
    let permissions = [];
    roles.forEach(async (role) => {
      permissions = permissions.concat(role.permissions);
    });
    return permissions;
  };

  /**
   * This method can be used to conveniently check whether the user can perform
   * a given action on an entity. This can prove useful if you still need to
   * perform an authorization check without necessary doing it at the
   * routing level.
   *
   * @param action
   * @param entity
   * @param req
   * @returns {Promise<boolean>}
   */
  User.prototype.can = async function f(action, entity, req = null) {
    return (
      authorize(action, entity, await this.getPermissions(), policies, req) ===
      true
    );
  };

  return User;
};
