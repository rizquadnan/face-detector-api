const express = require('express')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')
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
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')
const clarafai = ClarifaiStub.grpc()
const clarafaiMeta = new grpc.Metadata()
clarafaiMeta.set('authorization', 'Key e3e2fff270c541c4ab887d0ab7c1fbf2')

const auth = require('./controllers/auth')
const user = require('./controllers/user')
const image = require('./controllers/image')

const JWT_PRIVATE_KEY = 'e023da7092d3471e30edcef8a60d25024dbc442439c2ffdebeeeee665d9ebc1ac21ae9d70031319c58535f9868975f529629de31dd4ebac1c18bde4d18640e64'
const PORT = process.env.PORT ?? 3001
const SALT_ROUNDS = 10
const API_BASE_URL = '/api/v1/'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/health', (req, res) => {
  res.send('OK')
})

app.post(
  `${API_BASE_URL}sign-in`,
  auth.signIn(db, bcrypt, jwt, JWT_PRIVATE_KEY),
)

app.post(
  `${API_BASE_URL}register`,
  auth.register(db, bcrypt, jwt, JWT_PRIVATE_KEY, uuidv4, SALT_ROUNDS),
)

app.put(
  `${API_BASE_URL}user/:id`,
  auth.verifyUserAuth(db, jwt, JWT_PRIVATE_KEY),
  auth.onVerifyUserAuthComplete,
  user.detail(db),
)

app.post(
  `${API_BASE_URL}detect-face`,
  auth.verifyUserAuth(db, jwt, JWT_PRIVATE_KEY),
  auth.onVerifyUserAuthComplete,
  image.detectFace(clarafai, clarafaiMeta),
)

app.listen(PORT, () => console.log(`> Listening on port ${PORT}`))
