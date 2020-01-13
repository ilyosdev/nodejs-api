/**
 * This middleware just sets the req.context to an empty object.
 * req.context is used to add our custom request values to
 * avoid polluting or accidentally overriding important
 * req object values.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const init = (req, res, next) => {
  req.context = {};
  return next();
};

module.exports = init;
