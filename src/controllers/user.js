const { User, Role } = require('../models');
const { visibleUserAttributes } = require('../utils');

module.exports = {
  list: async (req, res) => {
    const users = await User.findAll({
      attributes: visibleUserAttributes,
    });
    return res.json({ users });
  },

  get: async (req, res) => {
    return res.json({ user: req.context.user.toJSON() });
  },

  setRoles: async (req, res) => {
    const { roleIds } = req.body;

    const roleCount = await Role.count({ where: { id: roleIds } });

    if (!(roleCount === roleIds.length)) {
      return res.status(400).json({
        message: 'One or more of the role ids you provided are invalid.',
      });
    }

    await req.context.user.setRoles(roleIds);

    return res.json({
      message: 'Successfully updated user roles.',
      user: await req.context.user.reload(),
    });
  },
};
