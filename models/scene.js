const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SceneImageSchema = new Schema({
  data: Buffer,
  contentType: String,
});

const SceneSchema = new Schema({
  sceneName: {
    type: String,
    required: true,
  },
  sceneImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SceneImage",
  },
});

const Scene = mongoose.model("Scene", SceneSchema);
const SceneImage = mongoose.model("SceneImage", SceneImageSchema);

module.exports = { Scene, SceneImage };
