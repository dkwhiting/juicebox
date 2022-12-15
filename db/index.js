const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/juicebox-dev')

const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`
    SELECT id, username, name, location
    FROM users;
    `)
    return rows
  } catch (error) {
    console.log('error getting users', error)
  }
}

const getAllPosts = async () => {
  try {
    const { rows } = await client.query(`
    SELECT * FROM posts;
    `)
    return rows
  } catch (error) {
    console.error('error getting posts', error)
  }
}

const getPostsByUser = async (userId) => {
  try {
    const { rows: [posts] } = await client.query(`
    SELECT * FROM posts
    WHERE "authorId" = $1
    ;`, [userId])
    return posts

  } catch (error) {
    console.error('error getting post by user', error)
  }
}

const getUserById = async (userId) => {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * from users
    WHERE id = ${userId}
    `)
    delete user.password
    user.posts = await getPostsByUser(userId)
    return user
  } catch (error) {
    console.error('error getting user by ID', error)
  }
}

const createUser = async ({
  username,
  password,
  name,
  location
}) => {
  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users(username, password, name, location)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (username) DO NOTHING
    RETURNING *
    `, [username, password, name, location]);

    return user

  } catch (error) {
    console.error('error creating user')
  }
}

const createPost = async ({
  authorId,
  title,
  content
}) => {
  try {
    console.log('starting to create post')
    const { rows: [post] } = await client.query(`
    INSERT INTO posts ("authorId", title, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [authorId, title, content])
    console.log('finished creating post')
    return post
  } catch (error) {
    console.error('error creating post', error)
  }
}

const updateUser = async (id, fields = {}) => {
  const keys = Object.keys(fields)
  const setString = keys.map((key, index) => {
    return `"${key}" = $${index + 1}`
  }).join(', ')


  if (setString.length === 0) {
    return;
  }

  for (let key of keys) {
    if (!['username',
      'password',
      'name',
      'location',
      'active'].includes(key))
      return;
  }

  try {
    const { rows: [user] } = await client.query(`
    UPDATE users
    SET ${setString}
    WHERE id = ${id}
    RETURNING *
    `, Object.values(fields))
    console.log('finished updating user')
    return user
  } catch (error) {
    console.error('error updating user', error)
  }
}

const updatePost = async (id, fields = {}) => {
  const keys = Object.keys(fields)
  const setString = keys.map((key, index) => {
    return `"${key}" = $${index + 1}`
  }).join(', ')

  if (setString.length === 0) return;
  for (let key of keys) {
    if (!['authorId', 'title', 'content', 'active'].includes(key)) return;
  }

  try {
    const { rows: [post] } = await client.query(`
    UPDATE posts
    SET ${setString}
    RETURNING *
    ;`, Object.values(fields))

    return post
  } catch (error) {
    console.error('error updating post', error)
  }
}

module.exports = {
  client,
  getAllUsers,
  getAllPosts,
  getPostsByUser,
  getUserById,
  createUser,
  createPost,
  updateUser,
  updatePost
}