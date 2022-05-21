const News = require("./../models/news");
const Tags = require("./../models/tags");
const redis = require("./../infra/redis");

exports.get = async (req, res) => {
  try {
    let status = req.query.status;
    let topic = req.query.topic;
    let news;
    if (status) {
      news = await redis.get(status);
      if (news == null) {
        news = await News.find({ status: status });
        if (!Object.keys(news).length === 0) {
          await redis.set(status, news);
        }
      }
      return res.status(200).json({
        code: 200,
        message: "Success List News by Status",
        data: news,
      });
    }
    if (topic) {
      news = await redis.get(topic);
      if (news == null) {
        news = await Tags.find({ name: topic }).populate("news");
        if (!Object.keys(news).length === 0) {
          await redis.set(topic, news);
        }
      }
      return res.status(200).json({
        code: 200,
        message: "Success List News by Topic",
        data: news,
      });
    }

    news = await redis.get("news");
    if (news == null) {
      news = await News.find();
      await redis.set("news", news);
    }

    return res.status(200).json({
      code: 200,
      message: "Success List News",
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      message: "bad request",
    });
  }
};

exports.post = async (req, res) => {
  try {
    const { name, status, tags } = req.body;

    let tagId = [];
    for (let data in tags) {
      let tag = await Tags.findOne({ name: tags[data] });
      if (!tag) {
        return res.status(404).json({
          code: 404,
          message: "Tag Not Found",
          data: tags[data],
        });
      }
      tagId.push(tag._id);
    }

    const news = {};
    news.name = name;
    news.status = status;
    const newNews = await News.create(news);

    for (let data in tagId) {
      await News.findByIdAndUpdate(newNews._id, {
        $push: { tags: tagId[data] },
      });
      await Tags.findByIdAndUpdate(tagId[data], {
        $push: { news: newNews._id },
      });
    }

    await redis.delete("news");

    return res.status(200).json({
      code: 200,
      message: "Success Create News",
      data: newNews,
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      message: "bad request",
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    let news = await redis.get(req.params.id);
    if (news == null) {
      news = await News.find({ _id: req.params.id }).populate("tags");
      if (!Object.keys(news).length === 0) {
        await redis.set(req.params.id, news);
      }
    }

    res.status(200).json({
      code: 200,
      message: "Success Get News",
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      message: "bad request",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const news = await News.findOne({ _id: req.params.id });
    if (req.body.name) {
      news.name = req.body.name;
      news.status = req.body.status;
    }
    await news.save();
    await redis.delete(req.params.id);

    res.status(200).json({
      code: 200,
      message: "Success Update News",
      data: news,
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
    const news = await News.findOne({ _id: req.params.id });
    news.status = "delete";
    await news.save();
    await redis.delete(req.params.id);

    res.status(200).json({
      code: 200,
      message: "Success Delete News",
      data: news,
    });
  } catch (err) {
    res.status(500).json({
      err: err,
      message: "bad request",
    });
  }
};
