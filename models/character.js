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
    ref: "CharacterImage",
    required: true,
  },
});

const Character = mongoose.model("Character", CharacterSchema);
const CharacterImage = mongoose.model("CharacterImage", CharacterImageSchema);

module.exports = { Character, CharacterImage };
