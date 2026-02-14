import express from "express";
import bodyParser from "body-parser";
import voiceRoutes from "./routes/voice.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/process", voiceRoutes);

app.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});
