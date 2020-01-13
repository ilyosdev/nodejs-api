const router = require('express').Router();
const { getAppPermissions } = require('../utils');
const { can } = require('../middleware');

router.get('/', can('view', 'permission'), async (req, res) => {
  return res.json({
    permissions: getAppPermissions(),
  });
});

module.exports = router;
