const isProduction = process.env.NODE_ENV === "production";
const knex = require('knex')
require('dotenv').config();

const utils = require('../utils')

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
  database: 'facerecognition',
};
const db = knex({
  client: 'pg',
  connection: isProduction ? dbProductionConfig : dbDevelopmentConfig,
})
utils.setupDB(db)

const { v4: uuidv4 } = require('uuid')

const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

const jwt = require('jsonwebtoken')
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "development-key";

const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')
const clarafai = ClarifaiStub.grpc()
const clarafaiMeta = new grpc.Metadata()
clarafaiMeta.set('authorization', `Key ${process.env.CLARAFAI_KEY}`)

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