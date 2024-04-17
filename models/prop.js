const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropImageSchema = new Schema({
  data: Buffer,
  contentType: String,
});

const PropSchema = new Schema({
  characterName: {
    type: String,
    required: true,
  },
  propImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropImage",
    required: true,
  },
});

const Prop = mongoose.model("Prop", PropSchema);
const PropImage = mongoose.model("PropImage", PropImageSchema);

module.exports = { Prop, PropImage };
