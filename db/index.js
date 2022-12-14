const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/juicebox-dev')

const getAllUsers = async () => {
  try {
    const { rows } = await client.query(`
    SELECT id, name 
    FROM users;
    `)
    return rows
  } catch (error) {
    console.log(error)
  }
}

const createUser = async ({ name, password }) => {
  try {
    const result = await client.query(`
    INSERT INTO users(name, password)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `, [name, password]);

    return result

  } catch (error) {
    console.error('error creating user')
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
}