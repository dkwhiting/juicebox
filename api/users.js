const express = require('express')
const router = express.Router();
const { getAllUsers, getUserByUsername, createUser } = require('../db');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env


router.use((req, res, next) => {
  console.log("A request is being made to /users")

  next();
});

router.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    })
  }

  try {
    const user = await getUserByUsername(username)

    if (user && user.password == password) {
      const userToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET)
      res.send({ message: 'You are logged in!', token: userToken })

    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      })
    }

  } catch (error) {
    console.log(error)
    next(error);

  }
});

router.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body

  try {
    const _user = await getUserByUsername(username)
    if (_user) {
      next({
        name: "UserExistsError",
        message: "User already registered"
      })
    }

    const newUser = await createUser({
      username,
      password,
      name,
      location
    })

    const token = jwt.sign({
      id: newUser.id,
      username: newUser.username
    }, JWT_SECRET, {
      expiresIn: '1w'
    })
    res.send({ message: `${username} successfully registered`, token: token })

  } catch ({ name, message }) {

    next({ name, message });
  }
})

module.exports = router
