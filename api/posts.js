const express = require('express')
const router = express.Router();
const { getAllPosts } = require('../db')

router.use((req, res, next) => {
  console.log('A request is being made to /posts')

  next();
})

router.get('/', async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts
  })
})

module.exports = (router)