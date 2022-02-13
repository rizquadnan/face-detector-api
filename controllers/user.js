const utils = require("../utils/index");

module.exports = {
  detail: (db) => async (req, res) => {
    const { id } = req.params
    const { uploadentries } = req.body

    try {
      const result = await db('users')
        .where({ id })
        .returning('*')
        .update({ uploadentries })

      if (result.length > 0) {
        res.send(
          utils.createResponse({
            status: 'SUCCESS',
            data: result,
          }),
        )
      } else {
        throw new Error('user not found')
      }
    } catch (error) {
      if (error.message === 'user not found') {
        res.status(404).send(
          utils.createResponse({
            status: 'FAILED',
            description: 'User not found',
          }),
        )
      } else {
        res.status(500).send(
          utils.createResponse({
            status: 'FAILED',
            description: 'Failed to update user',
          }),
        )
      }
    }
  },
}