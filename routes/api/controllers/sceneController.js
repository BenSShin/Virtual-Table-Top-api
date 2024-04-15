const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const multer = require("multer");
const { Scene, SceneImage } = require("../../../models/scene");
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
      sceneImage: sceneImage._id,
    });
    await newScene.save();

    res.status(201).json({ message: "Scene created with image.", scene: newScene });
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/:sceneId/image", async (req, res) => {
  // use sceneImage id not scene Id
  try {
    const sceneId = req.params.sceneId;
    const scene = await SceneImage.findById(sceneId);
    if (!scene) {
      return res.status(404).json({ error: "Scene image not Found." });
    }
    res.set("Content-Type", scene.contentType);
    res.send(scene.data);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
