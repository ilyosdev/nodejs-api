const { init, authenticate } = require('../middleware');
const auth = require('./auth');
const role = require('./role');
const user = require('./user');
const article = require('./article');
const permission = require('./permission');

module.exports = (app) => {
  app.use(init);
  app.use(authenticate);

  app.get('/', (req, res) => res.json({ message: 'Postgres. Welcome :)' }));

  app.use('/auth', auth);
  app.use('/role', role);
  app.use('/user', user);
  app.use('/article', article);
  app.use('/permission', permission);
};
