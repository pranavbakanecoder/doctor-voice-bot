require("dotenv").config();
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

client.calls.create({
  to: "+917559241035", // YOUR verified number
  from: process.env.TWILIO_PHONE_NUMBER,
  url: process.env.PUBLIC_URL + "/voice"
})
.then(call => console.log("Calling you! SID:", call.sid))
.catch(console.error);
