const express = require('express')
const router = express.Router();
const { getAllTags, getPostsByTagName } = require('../db')

router.use((req, res, next) => {
  console.log('A request is being made to /tags')

  next();
});

router.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags
  });
});


router.get('/:tagName/posts', async (req, res, next) => {
  try {
    const posts = await getPostsByTagName(req.params.tagName)
    console.log(req.params)
    res.send({ posts: posts })
  } catch (error) {

  }
});

module.exports = (router)