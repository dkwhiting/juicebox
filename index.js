require('dotenv').config();
const PORT = 3000
const express = require('express')
const server = express()
const apiRouter = require('./api')

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json())


server.use((req, res, next) => {
  console.log("_____Body logger START_____")
  console.log(req.body)
  console.log("_____Body logger END_____")

  next();
})

server.use('/api', apiRouter)

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})