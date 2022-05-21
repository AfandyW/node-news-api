const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String,
  status: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tags' }],
});

module.exports = mongoose.model("News", schema);
