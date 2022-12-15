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
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      active BOOLEAN DEFAULT true
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
    const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Albert', location: 'NYC' });
    const sandra = await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandra', location: 'LA' });
    const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Tanya', location: 'Sicily' });
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


