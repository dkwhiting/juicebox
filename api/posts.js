const express = require('express')
const router = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require('../db')
const { decodeData, requireUser } = require('./utils')

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


router.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body
  const tagArr = tags.trim().split(/\s+/)
  const postData = { authorId: req.user.id, title: title, content: content }
  if (tagArr.length) {
    postData.tags = tagArr
  }

  try {
    const post = await createPost(postData)
    if (post) {
      res.send({ post })
    } else {
      next({
        name: 'ErrorPosting',
        message: 'Unable to create new post'
      })
    }
  } catch ({ name, message }) {
    next(name, message)
  }
})


router.patch('/:postId', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body
  const { postId } = req.params
  const updateFields = {}

  if (title) {
    updateFields.title = title
  }

  if (content) {
    updateFields.content = content
  }

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  try {
    const originalPost = await getPostById(postId)
    if (originalPost.author.id === req.user.id) {
      debugger
      const updatedPost = await updatePost(postId, updateFields)
      if (updatedPost) {

        res.json(updatedPost)
      } else {
        next({
          title: "UpdatePostError",
          message: "Unable to update post"
        })
      }
    } else {
      next({
        title: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours"
      })
    }
  } catch ({ name, message }) {
    next({ name, message })
  }

  // res.send(title)
})

router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  });
});

module.exports = router