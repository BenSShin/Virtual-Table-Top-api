const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { Prop, PropImage } = require("../../../models/prop");

router.post("/create/prop", upload.single("image"), async (req, res) => {
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).json({ error: "No image uploaded." });
  }
  try {
    const propImage = new PropImage({
      data: imageFile.buffer,
      contentType: imageFile.mimetype,
    });
    await propImage.save();

    const newProp = new Prop({
      propName: req.body.propName,
      propImage: propImage._id,
    });
    await newProp.save();

    res.status(201).json({ message: "Prop created with image.", prop: newProp });
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.get("/:propId/image", async (req, res) => {
  try {
    const propId = req.params.propId;
    const prop = await PropImage.findById(propId);
    if (!prop) {
      return res.status(404).json({ error: "Prop image not found." });
    }
    res.set("Content-Type", prop.contentType);
    res.send(prop.data);
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

module.exports = router;
