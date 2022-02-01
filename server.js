const express = require('express')

const app = express()
const PORT = 3001;
const API_BASE_URL = "/api/v1/";

const createUser = ({ name, email, password, uploadEntries, joinDate }) => ({
  name,
  email,
  password,
  uploadEntries,
  joinDate,
})

const createResponse = ({ status, description = '', data = {} }) => ({
  status,
  description,
  data,
})

const users = [
  createUser({
    name: 'budi',
    email: 'budi@gmail.com',
    password: 'budi12',
    uploadEntries: 0,
    joinDate: new Date().toDateString(),
  }),
  createUser({
    name: 'riani',
    email: 'riani@gmail.com',
    password: 'riani12',
    uploadEntries: 0,
    joinDate: new Date().toDateString(),
  }),
]

app.use(express.json())

app.get('/health', (req, res) => {
  res.send('OK')
})

app.get(`${API_BASE_URL}sign-in`, (req, res) => {
  const { email, password } = req.body

  const user = users.find((user) => user.email === email)
  if (user && user.password === password) {
    res.send(createResponse({ status: 'SUCCESS', data: user }))
  } else {
    res
      .status(404)
      .send(
        createResponse({
          status: 'FAILED',
          description: 'Email or password incorrect',
        }),
      ) 
  }
});

app.listen(PORT, () => console.log(`> Listening on port ${PORT}`))
