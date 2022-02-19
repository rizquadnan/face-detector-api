const isProduction = process.env.NODE_ENV === "production";

const dbProductionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};
const dbDevelopmentConfig = {
  host: '127.0.0.1',
  port: 5432,
  user: '',
  password: '',
  database: 'face-recognition',
};
const db = require('knex')({
  client: 'pg',
  connection: isProduction ? dbProductionConfig : dbDevelopmentConfig,
})

const { v4: uuidv4 } = require('uuid')

const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

const jwt = require('jsonwebtoken')
const JWT_PRIVATE_KEY = 'e023da7092d3471e30edcef8a60d25024dbc442439c2ffdebeeeee665d9ebc1ac21ae9d70031319c58535f9868975f529629de31dd4ebac1c18bde4d18640e64'

const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')
const clarafai = ClarifaiStub.grpc()
const clarafaiMeta = new grpc.Metadata()
clarafaiMeta.set('authorization', 'Key e3e2fff270c541c4ab887d0ab7c1fbf2')

const PORT = process.env.PORT ?? 3001

const API_BASE_URL = '/api/v1/'

module.exports = {
  db,
  uuidv4,
  bcrypt,
  jwt,
  clarafai,
  clarafaiMeta,
  JWT_PRIVATE_KEY,
  PORT,
  SALT_ROUNDS,
  API_BASE_URL
}