const {
  client,
  getAllUsers,
  getAllPosts,
  getAllTags,
  getPostsByUser,
  getPostsById,
  getUserById,
  createUser,
  createPost,
  createTags,
  createPostTag,
  updateUser,
  updatePost,
  addTagsToPost
} = require('./index')



const dropTables = async () => {
  try {
    console.log('starting to drop tables...')
    await client.query(`
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
    `)
    console.log('finished dropping tables!')
  } catch (error) {
    console.error('error dropping tables!')
  }
}

const createTables = async () => {
  try {
    console.log('starting to create tables...')
    await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true
      );
    CREATE TABLE posts(
      id SERIAL PRIMARY KEY,
      "authorId" INTEGER REFERENCES users(id) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      active BOOLEAN DEFAULT true
    );
    CREATE TABLE tags(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE post_tags(
      "post_id" INTEGER REFERENCES posts(id),
      "tag_id" INTEGER REFERENCES tags(id),
      UNIQUE ("post_id", "tag_id")
    );
    `)

    console.log('finished creating tables!')
  } catch (error) {
    console.error('error creating tables!', error)
  }
}

const createInitialUsers = async () => {
  try {
    console.log('starting to create users...')
    const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Al bert', location: 'NYC' });
    const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra', location: 'LA' });
    const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Tanya', location: 'Sicily' });
    console.log('finished creating users!')
  } catch (error) {
    console.error('error creating users!')
  }
}

const createInitialPosts = async () => {
  try {
    const [albert, sandra, glamgal] = await getAllUsers()
    await createPost({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post. I hope I love writing blogs as much as I love writing them."
    })
    await createPost({
      authorId: sandra.id,
      title: "Is this real?",
      content: "I woke up this morning and I felt like I wasn't me. Is this a simulation? Am I already dead?"
    })
    await createPost({
      authorId: glamgal.id,
      title: "DO YOU KNOW THESE GAYS?",
      content: "HELP I THINK THESE GAYS ARE GOING TO KILL ME! xoxox"
    })
  } catch (error) {
    console.log('error creating inital posts', error)
  }
}

const createInitialTags = async () => {
  try {
    console.log("Starting to create tags...");

    const [happy, sad, inspo, catman] = await createTags([
      '#happy',
      '#worst-day-ever',
      '#youcandoanything',
      '#catmandoeverything'
    ]);

    const [postOne, postTwo, postThree] = await getAllPosts();

    await addTagsToPost(postOne.id, [happy, inspo]);
    await addTagsToPost(postTwo.id, [sad, inspo]);
    await addTagsToPost(postThree.id, [happy, catman, inspo]);

    console.log("Finished creating tags!");
  } catch (error) {
    console.log('error creating initial tags!', error)
  }
}

const rebuildDB = async () => {
  try {
    console.log('starting to rebuild database')
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createInitialTags();
    console.log('finished rebuilding database')
  } catch (error) {
    console.error('error rebuilding database')
  }
}

const testDB = async () => {
  try {
    console.log("Starting to test database...");

    // console.log("Calling getAllUsers");
    // const users = await getAllUsers();
    // console.log("Result:", users);

    // console.log("Calling getPostsByUser")
    // const postsByUser = await getPostsByUser(users[0].id)
    // console.log("Result:", postsByUser)


    // console.log("Calling updateUser on users[0]");
    // const updateUserResult = await updateUser(users[0].id, {
    //   name: "Newname Sogood",
    //   location: "Lesterville, KY"
    // });
    // console.log("Result:", updateUserResult);

    // console.log("Calling ")

    // console.log("Calling getAllPosts");
    // const posts = await getAllPosts();
    // console.log("Result:", posts);

    // console.log("Calling updatePost on posts[0]");
    // const updatePostResult = await updatePost(posts[0].id, {
    //   title: "New Title",
    //   content: "Updated Content"
    // });
    // console.log("Result:", updatePostResult);

    // console.log("Calling getUserById with 1");
    // const albert = await getUserById(1);
    // console.log("Result:", albert);

    // await getAllTags()
    await createPostTag(1, 1)
    await createPostTag(1, 2)
    // await getPostsById(1)
    await getPostsByUser(1)

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  } finally {
    client.end();
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end())


