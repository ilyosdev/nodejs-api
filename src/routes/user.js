const router = require('express').Router();
const { can, processUserParam } = require('../middleware');
const { user } = require('../controllers');

/**
 * A helper function to create an authorization middleware specific
 * to roles. This prevents repetition of the entity argument.
 *
 * @param action
 * @returns {*}
 */
const authorize = (action) => {
  return can(action, 'user');
};

router.get('/', authorize('view'), user.list);
router.get('/:id', processUserParam, authorize('view'), user.get);
router.put('/:id/role', processUserParam, authorize('setRoles'), user.setRoles);

module.exports = router;
