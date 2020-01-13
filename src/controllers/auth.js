const { User } = require('../models');
const { generateAuthToken, checkPassword } = require('../utils');

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (user) {
      if (checkPassword(password, user)) {
        const token = await generateAuthToken(user);
        if (token) {
          return res.status(200).json({
            token,
            message: 'You have logged in successfully.',
          });
        }
      }
    } else {
      return res.status(401).json({
        message: "The username and password don't match.",
      });
    }
    return res.status(500).json({
      message: 'Something bad happened :(.',
    });
  },
};
