const router = require('express').Router();
const { can, processArticleParam } = require('../middleware');
const { article } = require('../controllers');

/**
 * A helper function to create an authorization middleware specific
 * to articles. This prevents repetition of the entity argument.
 *
 * @param action
 * @returns {*}
 */
const authorize = (action) => {
  return can(action, 'article');
};

router.get('/', authorize('view'), article.list);
router.get('/:id', processArticleParam, authorize('view'), article.get);
router.post('/', authorize('create'), article.create);
router.put('/:id', processArticleParam, authorize('update'), article.update);
router.delete('/:id', processArticleParam, authorize('delete'), article.delete);

module.exports = router;
