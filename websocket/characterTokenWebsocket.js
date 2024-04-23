const CharacterToken = require("../models/characterToken"); // Import your Mongoose model

function handleConnection(ws) {
  console.log("New WebSocket connection");

  ws.on("message", function incoming(message) {
    console.log("Received message:", message);
    // Parse incoming message and update position of CharacterToken instance in the database
    const data = JSON.parse(message);
    updateCharacterTokenPosition(data.characterId, data.xPosition, data.yPosition);
  });

  ws.on("close", function close() {
    console.log("WebSocket connection closed");
  });
}

async function updateCharacterTokenPosition(characterId, xPosition, yPosition) {
  try {
    // Update position of CharacterToken instance in the database
    await CharacterToken.updateOne({ characterId: characterId }, { xPosition: xPosition, yPosition: yPosition });
    console.log("CharacterToken position updated:", { characterId, xPosition, yPosition });
  } catch (error) {
    console.error("Error updating CharacterToken position:", error);
  }
}

module.exports = { handleConnection };
