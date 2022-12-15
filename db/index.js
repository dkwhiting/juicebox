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
    console.log(error)
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

const updateUser = async (id, fields = {}) => {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [user] } = await client.query(`
    UPDATE users
    SET ${setString}
    WHERE id =${id}
    RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (error) {
    console.error('error updating user')
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
}