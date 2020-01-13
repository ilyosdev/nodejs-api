const { getAllPermissionsFor } = require('../../lib');
const { getAppPermissions } = require('../utils');

module.exports = {
  // since roles have permissions we allow anyone with any role permission
  // to view permissions
  view: {
    any: getAllPermissionsFor(getAppPermissions(), 'role'),
  },
};
