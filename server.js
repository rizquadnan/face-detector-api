const {
  db,
  uuidv4,
  bcrypt,
  jwt,
  clarafai,
  clarafaiMeta,
  JWT_PRIVATE_KEY,
  PORT,
  SALT_ROUNDS,
  API_BASE_URL,
} = require('./config')

const express = require('express')
const cors = require('cors')

const auth = require('./controllers/auth')
const user = require('./controllers/user')
const image = require('./controllers/image')

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
