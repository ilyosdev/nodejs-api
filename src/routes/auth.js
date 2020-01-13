const router = require('express').Router();
const { auth } = require('../controllers');

router.post('/login', auth.login);

module.exports = router;
