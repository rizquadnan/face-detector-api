const express = require('express')

const app = express()
const PORT = 3001;
const API_BASE_URL = "/api/v1/";

const createUser = ({ name, email, password, uploadEntries = 0, joinDate = new Date().toDateString() }) => ({
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
  }),
  createUser({
    name: 'riani',
    email: 'riani@gmail.com',
    password: 'riani12',
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

app.post(`${API_BASE_URL}register`, (req, res) => {
  const { name, email, password } = req.body;

  if (name && email && password) {
    const user = createUser({ name, email, password });
    users.push(user);

    res.send(createResponse({ status: "SUCCESS", data: user }))
  } else {
    res.status(404).send(createResponse({ status: "FAILED", description: "Input not valid" }))
  }
});

app.listen(PORT, () => console.log(`> Listening on port ${PORT}`))
