const express = require('express')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const cors = require('cors')
const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: '',
    password: '',
    database: 'face-recognition',
  },
})

const PORT = 3001
const SALT_ROUNDS = 10
const API_BASE_URL = '/api/v1/'

const app = express()

const createUser = ({
  id = uuidv4(),
  name,
  email,
  password,
  uploadEntries = 0,
  joinDate = new Date().toDateString(),
}) => {
  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => {
      return {
        id,
        name,
        email,
        password: hash,
        uploadEntries,
        joinDate,
      }
    })
    .catch((error) => console.log('Failed to create user', error))
}

const createResponse = ({ status, description = '', data = {} }) => ({
  status,
  description,
  data,
})

const usersInitPromise = [
  createUser({
    name: 'budi',
    email: 'budi@gmail.com',
    password: 'budi12',
  }),
  createUser({
    name: 'riani',
    email: 'riani@gmail.com',
    password: 'riani12',
  }),
]

let users
Promise.all(usersInitPromise).then((values) => {
  users = values
})

app.use(express.json())
app.use(cors())

app.get('/health', (req, res) => {
  res.send('OK')
})

app.post(`${API_BASE_URL}sign-in`, (req, res) => {
  const { email, password: inputtedPassword } = req.body
  const user = users.find((user) => user.email === email)

  if (user) {
    bcrypt.compare(inputtedPassword, user.password).then((isIdentical) => {
      if (isIdentical) {
        const { password, ...returnedUser } = user

        res.send(createResponse({ status: 'SUCCESS', data: returnedUser }))
      } else {
        res.status(404).send(
          createResponse({
            status: 'FAILED',
            description: 'Email or password incorrect',
          }),
        )
      }
    })
  } else {
    res.status(404).send(
      createResponse({
        status: 'FAILED',
        description: 'Email or password incorrect',
      }),
    )
  }
})

app.post(`${API_BASE_URL}register`, async (req, res) => {
  const { name, email, password } = req.body

  if (name && email && password) {
    const user = await createUser({ name, email, password })

    try {
      await db.transaction(async (trx) => {
        await trx.insert({ email, hash: user.password }).into('login')
        
        const result = await trx
          .returning('*')
          .insert({ name, email, joindate: new Date() })
          .into('users')

        res.send(
          createResponse({
            status: 'SUCCESS',
            data: result[0],
          }),
        )
      })
    } catch (error) {
      if (error.code === '23505') {
        res.status(400).send(
          createResponse({
            status: 'FAILED',
            description: 'Email already exists',
          }),
        )
      } else {
        res.status(404).send(
          createResponse({
            status: 'FAILED',
            description: 'Failed to register user',
          }),
        )
      }
    }
  } else {
    res
      .status(404)
      .send(
        createResponse({ status: 'FAILED', description: 'Input not valid' }),
      )
  }
})

app.get(`${API_BASE_URL}user/:id`, (req, res) => {
  const { id } = req.params

  const user = users.find((user) => user.id === id)
  if (user) {
    res.send(createResponse({ status: 'SUCCESS', data: user }))
  } else {
    res
      .status(404)
      .send(createResponse({ status: 'FAILED', description: 'User not found' }))
  }
})

app.put(`${API_BASE_URL}user/:id`, (req, res) => {
  const { id } = req.params
  const changedUser = req.body

  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex !== -1) {
    users[userIndex] = {
      ...changedUser,
      password: users[userIndex].password,
      id,
    }

    res.send(createResponse({ status: 'SUCCESS', data: changedUser }))
  } else {
    res
      .status(404)
      .send(createResponse({ status: 'FAILED', description: 'User not found' }))
  }
})

app.listen(PORT, () => console.log(`> Listening on port ${PORT}`))
