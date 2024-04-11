const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const multer = require("multer");
const SceneImage = require("../../../models/scene");
const Scene = require("../../../models/scene");
const ObjectId = require("mongodb").ObjectId;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create/scene", upload.single("image"), async (req, res) => {
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).json({ error: "No image uploaded." });
  }
  try {
    const sceneImage = new SceneImage({
      data: imageFile.buffer,
      contentType: imageFile.mimetype,
    });
    await sceneImage.save();

    const newScene = new Scene({
      sceneName: req.body.sceneName,
      sceneImage: sceneImage.ObjectId,
    });
    await newScene.save();

    res.status(201).json({ message: "Scene created with image.", scene: newScene });
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});
