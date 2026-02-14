const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { generateVoice } = require("./elevenlabs");

const BASE_URL = "https://unexpediently-unbrawny-jonnie.ngrok-free.dev";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// serve audio files
app.use("/audio", express.static(path.join(process.cwd(), "public/audio")));


// CALL START
app.post("/voice", async (req, res) => {

  const audioPath = await generateVoice(
    "Hello, this is the AI receptionist of City Clinic. How may I help you today?"
  );

  const twiml = `
<Response>
  <Play>${BASE_URL}${audioPath}</Play>
  <Gather input="speech" action="/process" method="POST" timeout="5"/>
</Response>`;

  res.type("text/xml");
  res.send(twiml);
});


// AFTER SPEECH
app.post("/process", async (req, res) => {

  const speech = req.body.SpeechResult || "I didn't hear anything";
  console.log("User said:", speech);

  const reply = `You said ${speech}. We will continue shortly.`;

  const audioPath = await generateVoice(reply, "reply.mp3");

  const twiml = `
<Response>
  <Play>${BASE_URL}${audioPath}</Play>
  <Gather input="speech" action="/process" method="POST" timeout="5"/>
</Response>`;

  res.type("text/xml");
  res.send(twiml);
});


app.listen(5000, () => console.log("Server running on 5000"));
