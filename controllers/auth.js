const utils = require("../utils/index");

module.exports = {
  signIn: (db, bcrypt, jwt, JWT_PRIVATE_KEY) => async (req, res) => {
    const { email, password: inputtedPassword } = req.body

    try {
      const result = await db('login').where({ email }).select('hash')
      const userPasswordHash = result[0].hash

      if (userPasswordHash) {
        const isIdentical = await bcrypt.compare(
          inputtedPassword,
          userPasswordHash,
        )

        if (isIdentical) {
          const result = await db('users').where({ email })
          const user = result[0]

          utils.jwtSign(jwt, { id: user.id }, JWT_PRIVATE_KEY, function (
            err,
            token,
          ) {
            if (err) {
              console.log("masuk sini", err);
              res.status(500).send(
                utils.createResponse({
                  status: 'FAILED',
                  description: 'Failed to sign in',
                }),
              )

              return
            }

            res.send(
              utils.createResponse({
                status: 'SUCCESS',
                data: {
                  user,
                  token,
                },
              }),
            )
          })

          return
        }
      }

      throw new Error('404')
    } catch (error) {
      if (error.message === '404') {
        res.status(404).send(
          utils.createResponse({
            status: 'FAILED',
            description: 'Email or password incorrect',
          }),
        )
      } else {
        res.status(500).send(
          utils.createResponse({
            status: 'FAILED',
            description: 'Failed to sign in',
          }),
        )
      }
    }
  },
  register: (db, bcrypt, jwt, JWT_PRIVATE_KEY, uuidv4, SALT_ROUNDS) => async (req, res) => {
    const { name, email, password } = req.body
  
    if (name && email && password) {
      const user = await utils.createUser(bcrypt, uuidv4, SALT_ROUNDS)({ name, email, password })
  
      try {
        await db.transaction(async (trx) => {
          await trx.insert({ email, hash: user.password }).into('login')
  
          const result = await trx
            .returning('*')
            .insert({ name, email, joindate: new Date() })
            .into('users')
  
          const userResult = result[0]
  
          utils.jwtSign(jwt, { id: userResult.id }, JWT_PRIVATE_KEY, function (err, token) {
            if (err) {
              res.status(500).send(
                utils.createResponse({
                  status: 'FAILED',
                  description: 'Failed to register user',
                }),
              )
  
              return
            }
  
            res.send(
              utils.createResponse({
                status: 'SUCCESS',
                data: {
                  user: userResult,
                  token,
                },
              }),
            )
          })
        })
      } catch (error) {
        if (error.code === '23505') {
          res.status(400).send(
            utils.createResponse({
              status: 'FAILED',
              description: 'Email already exists',
            }),
          )
        } else {
          res.status(500).send(
            utils.createResponse({
              status: 'FAILED',
              description: 'Failed to register user',
            }),
          )
        }
      }
    } else {
      res
        .status(400)
        .send(
          utils.createResponse({ status: 'FAILED', description: 'Input not valid' }),
        )
    }
  },
  verifyUserAuth: (db, jwt, JWT_PRIVATE_KEY) => async (req, res, next) => {
    const hasAuthorizationHeaders = req.headers?.authorization
  
    if (!hasAuthorizationHeaders) {
      req.isUserAuthenticated = false
  
      next()
  
      return
    }
  
    const token = req.headers.authorization
  
    jwt.verify(token, JWT_PRIVATE_KEY, async (err, decode) => {
      if (err) {
        req.isUserAuthenticated = false
  
        next()
  
        return
      }
  
      const result = await db('users').where({ id: decode.id })
  
      if (result.length > 0) {
        req.isUserAuthenticated = true
      } else {
        req.isUserAuthenticated = false
      }
  
      next()
    })
  },
  onVerifyUserAuthComplete: (req, res, next) => {
    if (!req.isUserAuthenticated) {
      res.status(403).send(
        utils.createResponse({
          status: 'FAILED',
          description: 'Unauthorised access',
        }),
      )
    } else {
      next()
    }
  }
}
