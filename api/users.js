const express = require('express')
const router = express.Router();
const { getAllUsers } = require('../db');

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

module.exports = (
  router
)