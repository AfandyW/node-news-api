const Tags = require("./../models/tags");
const redis = require("./../infra/redis");

exports.get = async (req, res) => {
  try {
    let tags = await redis.get("tags");
    if (tags == null) {
      tags = await Tags.find();
      await redis.set("tags", tags);
    }
    return res.status(200).json({
      code: 200,
      message: "Success List Tags",
      data: tags,
    });
  } catch (err) {
    return res.status(500).json({
      message: "bad request",
    });
  }
};

exports.post = async (req, res) => {
  const tags = new Tags({
    name: req.body.name,
  });
  try {
    await tags.save();
    await redis.delete("tags");

    return res.status(201).json({
      code: 201,
      message: "Success Create New Tags",
      data: tags,
    });
  } catch (err) {
    return res.status(500).json({
      message: "bad request",
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    let tag = await redis.get(req.params.id);
    if (tag == null) {
      tag = await Tags.findOne({ _id: req.params.id });
      await redis.set(req.params.id, tag);
    }

    return res.status(200).json({
      code: 200,
      message: "Success Get Tag",
      data: tag,
    });
  } catch (err) {
    res.status(500).json({
      message: "bad request",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const tag = await Tags.findOne({ _id: req.params.id });
    if (req.body.name) {
      tag.name = req.body.name;
    }
    await tag.save();
    await redis.delete(req.params.id);

    res.status(200).json({
      code: 200,
      message: "Success Update Tags",
      data: tag,
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      message: "bad request",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const tags = await Tags.findOne({ _id: req.params.id });
    await tags.delete();
    await redis.delete(req.params.id);

    return res.status(200).json({
      code: 200,
      message: "Success Delete Tag",
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      message: "bad request",
    });
  }
};
