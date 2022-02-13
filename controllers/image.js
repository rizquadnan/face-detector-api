const utils = require("../utils");

module.exports = {
  detectFace: (clarafai, clarafaiMeta) => (req, res) => {
    const { imageUrl } = req.body

    clarafai.PostModelOutputs(
      {
        model_id: 'a403429f2ddf4b49b307e318f00e528b',
        inputs: [{ data: { image: { url: imageUrl } } }],
      },
      clarafaiMeta,
      (err, response) => {
        if (err) {
          res.status(500).send(
            utils.createResponse({
              status: 'FAILED',
              description: 'Failed to detect face',
            }),
          )
        }

        res.send(
          utils.createResponse({
            status: 'SUCCESS',
            data: response.outputs[0].data.regions.map(
              (region) => region.region_info.bounding_box,
            ),
          }),
        )
      },
    )
  }
}