const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

async function generateVoice(text, filename="response.mp3") {
  try {
    const filePath = path.join("public/audio", filename);

    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      responseType: "arraybuffer",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "accept": "audio/mpeg",
        "Content-Type": "application/json"
      },
      data: {
        text: text,
        model_id: "eleven_turbo_v2_5"
      }
    });

    fs.writeFileSync(filePath, Buffer.from(response.data));
    return `/audio/${filename}`;

  } catch (err) {
    console.error("ElevenLabs error:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { generateVoice };
