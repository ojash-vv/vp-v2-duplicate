const Globaltypecategory = require("../models/globaltypecatModel");

exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const globaltypecat = new Globaltypecategory({
    email: req.body.email,
    name: req.body.name,
  });

  await Globaltypecategory.create(globaltypecat, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    else res.send(data);
  });
};
