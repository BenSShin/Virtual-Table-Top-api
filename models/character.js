const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterImageSchema = new Schema({
  data: Buffer,
  contentType: String,
});

const CharacterSchema = new Schema({
  characterName: {
    type: String,
    required: true,
  },
  characterImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SceneImage",
    required: true,
  },
});

const character = mongoose.model("Scene", CharacterSchema);
const characterImage = mongoose.model("SceneImage", CharacterImageSchema);

module.exports = { character, characterImage };
