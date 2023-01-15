module.exports = {
  createResponse: ({ status, description = "", data = {} }) => ({
    status,
    description,
    data,
  }),
  jwtSign: (jwt, dataToBeSigned, JWT_PRIVATE_KEY, callback) => {
    jwt.sign(dataToBeSigned, JWT_PRIVATE_KEY, { expiresIn: "1d" }, callback);
  },
  createUser:
    (bcrypt, uuidv4, SALT_ROUNDS) =>
    ({
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
          };
        })
        .catch((error) => console.log("Failed to create user", error));
    },
  setupDB: async (db) => {
    if (!(await db.schema.hasTable("users"))) {
      await db.schema.createTable("users", function (table) {
        table.increments("id");
        table.string("name", 100);
        table.string("email").primary("email", {
          constraintName: "users_primary_key",
          deferrable: "deferred",
        });
        table.integer("uploadentries");
        table.timestamp("joindate");
      });
    }

    if (!(await db.schema.hasTable("login"))) {
      await db.schema.createTable("login", function (table) {
        table.increments("id");
        table.string("email").references("email").inTable("users");
        table.string("hash");
      });
    }
  },
};
