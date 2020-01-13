const { User } = require('../models');
const { decodeAuthToken } = require('../utils');

/**
 * This middleware identifies the user making the request via the
 * authorization header. If it is not able to authenticate the
 * user it returns a 401 error response. Else, it adds the
 * user object to the req object to make it available to
 * all other consequent handlers.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const authenticate = async (req, res, next) => {
  // if the route is not protected proceed to the next handler
  if (req.url === '/' || req.url === '/auth/login') return next();
  // If this were session based auth system we would be verifying the
  // username/email and password combination against the session
  // in this step.
  try {
    const userData = decodeAuthToken(req);
    // Adding the user object to the request object so that all proceeding
    // handlers e.g. authorize middleware will know the authenticated
    // user.
    req.user = await User.findOne({ where: { username: userData.username } });
    return next();
  } catch (e) {
    return res.status(401).json({
      message: 'Sorry :( Log in and try again.',
    });
  }
};

module.exports = authenticate;
