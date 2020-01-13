const { User, Role, Article } = require('../models');
const { visibleUserAttributes } = require('../utils');

/**
 * This middleware checks whether the article whose id is passed as a
 * parameter on the request exits. If it does not exist it returns a
 * 404 error response. Else, it adds the article object to the
 * req.context object and calls the next handler.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const processArticleParam = async (req, res, next) => {
  const article = await Article.findOne({
    where: { id: req.params.id },
  });
  if (!article) {
    return res.status(404).json({
      message: 'The article does not exist.',
    });
  }
  req.context.article = article;
  return next();
};

/**
 * This middleware checks whether the role whose id is passed as a
 * parameter on the request exits. If it does not exist it returns a
 * 404 error response. Else, it adds the role object to the
 * req.context object and calls the next handler.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const processRoleParam = async (req, res, next) => {
  const role = await Role.findOne({
    where: { id: req.params.id },
    include: { model: User, as: 'users' },
  });
  if (!role) {
    return res.status(404).json({
      message: 'The role does not exist.',
    });
  }
  req.context.role = role;
  return next();
};

/**
 * This middleware checks whether the user whose id is passed as a
 * parameter on the request exits. If it does not exist it returns a
 * 404 error response. Else, it adds the role object to the
 * req.context object and calls the next handler.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const processUserParam = async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    attributes: visibleUserAttributes,
    include: { model: Role, as: 'roles' },
  });
  if (!user) {
    return res.status(404).json({
      message: 'The user does not exist.',
    });
  }
  req.context.user = user;
  return next();
};

module.exports = {
  processArticleParam,
  processRoleParam,
  processUserParam,
};
