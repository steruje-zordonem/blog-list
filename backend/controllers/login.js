const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json('Invalid username or password');
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET);
  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
