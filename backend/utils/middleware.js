const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!token || !decodedToken.id) {
    req.user = null;
    return res.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(decodedToken.id);
  req.user = user;

  next();
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }

  next(error);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  errorHandler,
};
