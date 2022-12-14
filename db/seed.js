const {
  client,
  getAllUsers,
  createUser,
} = require('./index')

const testDB = async () => {
  try {
    const users = await getAllUsers();
    console.log('TESTING DB:')
    console.log(users);
  } catch (error) {
    console.error('error testing database')
  } finally {
    client.end();
  }
}

const dropTables = async () => {
  try {
    console.log('starting to drop tables')
    await client.query(`
    DROP TABLE IF EXISTS users
    `)
    console.log('finished dropping tables')
  } catch (error) {
    console.error('error dropping tables')
  }
}

const createTables = async () => {
  try {
    console.log('starting to create tables')
    await client.query(`
    CREATE TABLE users(
      id SERIAL UNIQUE NOT NULL,
      name VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
      );
      `)
    console.log('finished creating tables')
  } catch (error) {
    console.error('error creating tables')
  }
}

const createInitialUsers = async () => {
  try {
    console.log('starting to create users...')
    const albert = await createUser({ name: 'albert', password: 'bertie99' });
    const sandra = await createUser({ name: 'sandra', password: '2sandy4me' });
    const glamgal = await createUser({ name: 'glamgal', password: 'soglam' });
    console.log('finished creating users!')
  } catch (error) {
    console.error('error creating users!')
  }
}

const rebuildDB = async () => {
  try {
    console.log('starting to rebuild database')
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    console.log('finished rebuilding database')
  } catch (error) {
    console.error('error rebuilding database')
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end())


