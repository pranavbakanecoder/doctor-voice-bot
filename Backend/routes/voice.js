import express from "express";
import { receiveSpeech } from "../controllers/voiceController.js";

const router = express.Router();

router.post("/receive", receiveSpeech);

export default router;
