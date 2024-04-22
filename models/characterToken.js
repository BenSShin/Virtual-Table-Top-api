const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterTokenSchema = new Schema({
  characterId: { type: String, required: true },
  xPosition: Number,
  yPositiion: Number,
});

const CharacterToken = mongoose.model("CharacterToken", CharacterTokenSchema);

module.exports = CharacterToken;
