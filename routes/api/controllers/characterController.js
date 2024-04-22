const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { Character, CharacterImage } = require("../../../models/character");
const { Schema } = require("mongoose");

router.post("/create/character", upload.single("image"), async (req, res) => {
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).json({ error: "No image uploaded." });
  }
  try {
    const characterImage = new CharacterImage({
      data: imageFile.buffer,
      contentType: imageFile.mimetype,
    });
    await characterImage.save();

    const newCharacter = new Character({
      characterName: req.body.characterName,
      characterImage: characterImage._id,
    });
    await newCharacter.save();

    res.status(201).json({ message: "Character created with image", character: newCharacter });
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

// to get the image info
router.get("/:characterId/info", async (req, res) => {
  try {
    const characterId = req.params.characterId;
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: "Character was not found." });
    }
    res.status(200).json(character);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

// to get the image
router.get("/:characterImageId/image", async (req, res) => {
  try {
    const characterId = req.params.characterImageId;
    const character = await CharacterImage.findById(characterId);
    if (!character) {
      return res.status(404).json({ error: "Character image not found" });
    }
    res.set("Content-Type", character.contentType);
    res.send(character.data);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
