const { authorize, createCan } = require('../../lib');
const { getAppPolicies } = require('../utils');

const policies = getAppPolicies();

/**
 * This middleware returns a middleware function that is able to authorize
 * the action that the user is trying to make on a given entity. If the
 * user is not allowed to perform the action it returns a 403 error
 * response. Else, it allows the request to proceed by calling the
 * next handler.
 *
 * @param action
 * @param entity
 * @returns {Function}
 */
// eslint-disable-next-line
const can1 = (action, entity) => {
  return async (req, res, next) => {
    const userPermissions = await req.user.getPermissions();
    try {
      // If any of your policies use the express req object you must pass it.
      // The req parameter is
      // optional.
      if (authorize(action, entity, userPermissions, policies, req) !== true) {
        return res.status(403).json({
          message: `You are not authorized to perform this action.`,
        });
      }
      return next();
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
      // three exceptions are possible: missing policy, missing policy action or
      // unexpected nested promise callback
      return res.status(500).json({
        message: 'Sorry :( Something bad happened.',
      });
    }
  };
};

/**
 * This function is similar to the one defined above but definition is abstracted.
 * You supply policies, an handler to resolve user permissions, an handler to
 * handle unauthorized requests and an handler to handle authorization
 * exceptions. This is a more clean approach since it wraps up the
 * entire process of authorization leaving very little room for
 * errors.
 */
const can2 = createCan(
  policies,
  async (req) => req.user.getPermissions(),
  (req, res) => {
    return res.status(403).json({
      message: `You are not authorized to perform this action.`,
    });
  },
  (req, res) => {
    return res.status(500).json({
      message: 'Sorry :( Something bad happened.',
    });
  },
);

module.exports = can2;
