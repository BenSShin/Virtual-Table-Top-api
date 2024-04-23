const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const CharacterToken = require("../../../models/characterToken");
const { Character } = require("../../../models/character");
const ObjectId = require("mongodb").ObjectId;

router.post("/create/character_token", async (req, res) => {
  try {
    const characterId = req.body.characterId;
    const characterDoc = await Character.findById(characterId);

    if (!characterDoc) {
      return res.status(404).json({ error: "This character doesn't exist." });
    } else {
      const newCharacterToken = new CharacterToken(req.body);
      newCharacterToken.save().catch((err) => console.log(err));
      return res.status(200).json(newCharacterToken);
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
