const router = require('express').Router();
const { can, processRoleParam } = require('../middleware');
const { role } = require('../controllers');

/**
 * A helper function to create an authorization middleware specific
 * to roles. This prevents repetition of the entity argument.
 *
 * @param action
 * @returns {*}
 */
const authorize = (action) => {
  return can(action, 'role');
};

router.get('/', authorize('view'), role.list);
router.get('/:id', processRoleParam, authorize('view'), role.get);
router.post('/', authorize('create'), role.create);
router.put('/:id', processRoleParam, authorize('update'), role.update);
router.delete('/:id', processRoleParam, authorize('delete'), role.delete);

module.exports = router;
