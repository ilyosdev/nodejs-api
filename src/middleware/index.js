const can = require('./can');
const init = require('./init');
const authenticate = require('./authenticate');
const processParam = require('./processParam');

module.exports = {
  can,
  init,
  authenticate,
  ...processParam,
};
