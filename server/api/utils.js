const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

const generateAccessToken = (id, username) => {
  return jwt.sign({ id: id, username: username }, JWT_SECRET, { expiresIn: '1w' })
}

const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: 'MissingUserError',
      message: 'You must be logged in to perform this action'
    });
  }
  next();
}

const decodeData = () => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  const data = jwt.verify(userToken, JWT_SECRET);
  return data
}

module.exports = {
  generateAccessToken,
  requireUser,
  decodeData
}