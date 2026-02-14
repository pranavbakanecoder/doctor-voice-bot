import axios from "axios";

export const receiveSpeech = async (req, res) => {
  const speechText = req.body.SpeechResult;
  const fromNumber = req.body.From;
  const callSid = req.body.CallSid;

  console.log("📞 Call SID:", callSid);
  console.log("📲 From:", fromNumber);
  console.log("🗣️ Speech:", speechText);

  try {
    // 🔁 Send speech to Python AI Agent
    const aiResponse = await axios.post(
      /*"https://xyz.ngrok-free.dev/process-speech",*/ "http://127.0.0.1:8000/process-speech",
      {
        callSid,
        speechText
      }
    );

    const replyText = aiResponse.data.reply;
    console.log(replyText)


       // IMPORTANT: return JSON, NOT TwiML
       res.json({
        reply: replyText
      });
    // 🗣️ Speak AI reply on call
  /*  res.type("text/xml");
    res.send(`
      <Response>
        <Say>${replyText}</Say>
      </Response>
    `);*/

  } catch (error) {
    console.error("❌ AI Agent Error:", error.message);

    res.type("text/xml");
    res.send(`
      <Response>
        <Say>Sorry, something went wrong. Please try again.</Say>
      </Response>
    `);
  }
};
