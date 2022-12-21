const {
  client,
  getAllUsers,
  getAllPosts,
  getAllTags,
  getPostsByUser,
  getPostById,
  getPostsByTagName,
  getUserById,
  getUserByUsername,
  createUser,
  createPost,
  createTags,
  createPostTag,
  updateUser,
  updatePost,
  addTagsToPost,
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
    const albert = await createUser({ username: 'jobin', password: 'bertie99', name: 'Sydney', location: 'NYC' });
    const sandra = await createUser({ username: 'xXxPISTOL_PETExXx', password: 'sl@ppin-DA-ba$$', name: 'Peter', location: 'LA' });
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
      content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
      tags: ["#happy", "#youcandoanything"]
    })
    await createPost({
      authorId: sandra.id,
      title: "Is this real?",
      content: "I woke up this morning and I felt like I wasn't me. Is this a simulation? Am I already dead?",
      tags: ["#happy", "#worst-day-ever"]
    })
    await createPost({
      authorId: glamgal.id,
      title: "More wine",
      content: "HELP! I am running out of wine. Please bring more",
      tags: ["#helpme", '#morechardonnay']
    })
  } catch (error) {
    console.log('error creating inital posts', error)
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
    console.log('finished rebuilding database')
  } catch (error) {
    console.error('error rebuilding database')
  }
}

const testDB = async () => {
  try {
    console.log("starting database tests...");
    const users = await getAllUsers(); // DO NOT COMMENT OUT THESE ROWS
    const posts = await getAllPosts(); // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    const tags = await getAllTags();

    console.log(users)


    //// <-- UNCOMMENT TESTS 1 AT A TIME --> ////

    //// <-- Tests getPostsByUser --> ////

    // console.log("TESTING: Calling getPostsByUser")
    // const postsByUser = await getPostsByUser(users[0].id)
    // console.log("Result:", postsByUser)


    //// <-- Tests getPostByUser --> ////
    // console.log("TESTING: Calling getPostById")
    // const postsById = await getPostById(2)
    // console.log("Result:", postsById)



    //// <-- Tests updateUser --> ////

    // console.log("TESTING: Calling updateUser on users[0]");
    // const originalUserResult = await getUserById(users[0].id)
    // const updatedUserResult = await updateUser(users[0].id, {
    //   name: "Newname Sogood",
    //   location: "Lesterville, KY",
    //   active: false
    // });
    // delete originalUserResult.posts
    // console.log("Original:", originalUserResult);
    // console.log("Result:", updatedUserResult);



    //// <-- Tests updatePost --> ////

    // console.log("TESTING: Calling updatePost on posts[0]");
    // const originalPostResult = await getPostById(posts[0].id)
    // const updatePostResult = await updatePost(posts[0].id, {
    //   title: "New Title",
    //   content: "Updated Content",
    //   tags: ['#anewtag', '#isthisworking?']
    // });
    // console.log("Original:", originalPostResult);
    // console.log("Result:", updatePostResult);



    //// <-- Tests getUserById --> ////

    // console.log("TESTING: Calling getUserById with 1");
    // const albert = await getUserById(1);
    // console.log("Result:", albert);
    // console.log("Nested tags from albert.posts[0]:", albert.posts[0].tags)



    //// <-- Tests getPostsByTagName --> ////

    // console.log("TESTING: Calling getPostsByTagName")
    // const getPostsByTagNameResult = await getPostsByTagName('#happy')
    // console.log("Result:", getPostsByTagNameResult)


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


