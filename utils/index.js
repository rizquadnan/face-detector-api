module.exports = {
  createResponse: ({ status, description = '', data = {} }) => ({
    status,
    description,
    data,
  }),
  jwtSign: (jwt, dataToBeSigned, JWT_PRIVATE_KEY, callback) => {
    jwt.sign(dataToBeSigned, JWT_PRIVATE_KEY, { expiresIn: '1d' }, callback)
  },
  createUser: (bcrypt, uuidv4, SALT_ROUNDS) => ({
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
}