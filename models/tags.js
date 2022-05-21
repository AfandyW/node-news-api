const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String,
  news: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
});

module.exports = mongoose.model("Tags", schema);
