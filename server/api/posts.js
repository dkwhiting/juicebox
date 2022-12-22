const express = require('express')
const router = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require('../db')
const { decodeData, requireUser } = require('./utils')

router.use((req, res, next) => {
  console.log('A request is being made to /posts')

  next();
})


router.get('/', async (req, res) => {
  try {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter(post => {
      return post.active || (req.user && post.author.id === req.user.id);
    });
    res.send(posts)

  } catch ({ name, message }) {
    next({ name, message })
  }
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
})

router.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? {
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});

router.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message
  });
});

module.exports = router