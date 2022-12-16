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
    const { rows: postIds } = await client.query(`
    SELECT id 
    FROM posts;
    `)

    const posts = await Promise.all(postIds.map(post => {
      return getPostById(post.id)
    }))

    return posts
  } catch (error) {
    console.error('error getting posts', error)
  }
}

const getPostsByUser = async (userId) => {
  try {
    const { rows: postIds } = await client.query(`
    SELECT id 
    FROM posts
    WHERE "authorId" = $1
    ;`, [userId])

    const posts = await Promise.all(postIds.map(post => {
      return getPostById(post.id)
    }))
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

const getPostById = async (postId) => {
  try {
    const { rows: [post] } = await client.query(`
    SELECT * FROM posts
    WHERE id = $1
    `, [postId])

    const { rows: tags } = await client.query(`
    SELECT * FROM tags
    JOIN post_tags
    ON tags.id = post_tags."tag_id"
    WHERE post_tags."post_id" = $1
    `, [postId])

    const { rows: [author] } = await client.query(`
    SELECT id, username, name, location
    FROM users
    WHERE id = $1
    `, [post.authorId])

    post.author = author
    post.tags = tags
    delete post.authorId
    return post;
  } catch (error) {
    console.error('error getting posts by id', error)
  }
}

const getPostsByTagName = async (tagName) => {
  try {
    const { rows: postIds } = await client.query(`
    SELECT posts.id FROM posts
    JOIN post_tags
      ON posts.id = post_tags."post_id"
    JOIN tags
      ON post_tags."tag_id" = tags.id
    WHERE tags.name = $1
    `, [tagName])
    return await Promise.all(postIds.map(post => getPostById(post.id)))
  } catch (error) {
    console.error(error)
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
  content,
  tags = []
}) => {
  try {
    const { rows: [post] } = await client.query(`
    INSERT INTO posts ("authorId", title, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [authorId, title, content])
    const tagList = await createTags(tags)
    return await addTagsToPost(post.id, tagList)
  } catch (error) {
    console.error('error creating post', error)
  }
}

const createTags = async (tagList) => {
  if (tagList.length === 0) return;

  const insertValues = tagList.map((_, index) => {
    return `$${index + 1}`
  }).join('), (')

  const selectValues = tagList.map((tag, index) => {
    return `$${index + 1}`
  }).join(', ')
  try {
    await client.query(`
    INSERT INTO tags(name)
    VALUES (${insertValues})
    ON CONFLICT (name) DO NOTHING
    `, tagList)

    const { rows } = await client.query(`
      SELECT * FROM tags
      WHERE name IN (${selectValues})
    `, tagList)

    return rows
  } catch (error) {
    console.error('error creating tags!', error)
  }
}

const createPostTag = async (postId, tagId) => {

  try {
    await client.query(`
      INSERT INTO post_tags("post_id", "tag_id")
      VALUES ($1, $2)
      ON CONFLICT ("post_id", "tag_id") DO NOTHING
    `, [postId, tagId])
  } catch (error) {
    console.log('error creating post tag', error)
  }
}

const addTagsToPost = async (postId, tagList) => {
  if (!postId) return;
  if (tagList.length === 0) return;
  try {
    const createPostTagPromises = tagList.map(tag => {
      createPostTag(postId, tag.id)
    })
    await Promise.all(createPostTagPromises)
    return await getPostById(postId)
  } catch (error) {
    console.log('error adding tags to post', error)
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
    return user
  } catch (error) {
    console.error('error updating user', error)
  }
}

const updatePost = async (postId, fields = {}) => {
  // read off the tags & remove that field 
  const { tags } = fields; // might be undefined
  delete fields.tags;

  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(`
         UPDATE posts
         SET ${setString}
         WHERE id=${postId}
         RETURNING *;
       `, Object.values(fields));
    }

    // return early if there's no tags to update
    if (tags === undefined) {
      return await getPostById(postId);
    }

    // make any new tags that need to be made
    const tagList = await createTags(tags);
    const tagListIdString = tagList.map(
      tag => `${tag.id}`
    ).join(', ');

    // delete any post_tags from the database which aren't in that tagList
    await client.query(`
       DELETE FROM post_tags
       WHERE "tag_id"
       NOT IN (${tagListIdString})
       AND "post_id"=$1;
     `, [postId]);

    // and create post_tags as necessary
    await addTagsToPost(postId, tagList);

    return await getPostById(postId);

  } catch (error) {
    console.error('error updating post', error)
  }
}

module.exports = {
  client,
  getAllUsers,
  getAllPosts,
  getPostsByUser,
  getPostById,
  getPostsByTagName,
  getUserById,
  createUser,
  createPost,
  createTags,
  createPostTag,
  updateUser,
  updatePost,
  addTagsToPost
}