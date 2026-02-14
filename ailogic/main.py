from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import os
import json

# ------------------ ENV ------------------

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ------------------ GEMINI CLIENT ------------------

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"

# ------------------ FASTAPI ------------------

app = FastAPI()

# ------------------ MODELS ------------------

class SpeechInput(BaseModel):
    callSid: str
    speechText: str

class AgentResponse(BaseModel):
    reply: str
    complete: bool

# ------------------ SYSTEM PROMPT ------------------

SYSTEM_PROMPT = """
You are an AI receptionist for a hospital booking appointments via phone.

Your goal:
Collect the following required fields:
- Patient name
- Doctor name or specialization
- Appointment date
- Appointment time

Rules:
1. Ask only ONE missing piece of information at a time.
2. Be short and natural (like a real receptionist).
3. When ALL required information is collected:
   - Confirm the booking in one clear sentence.
   - Set "complete": true
   - DO NOT ask any more questions.
4. If some information is missing:
   - Ask only for the next missing field.
   - Set "complete": false

VERY IMPORTANT:
Return ONLY valid JSON in this exact format:

{
  "reply": "text to speak",
  "complete": false
}

No markdown.
No explanation.
No extra text.
No code blocks.
"""

# ------------------ API ------------------

@app.post("/process-speech", response_model=AgentResponse)
def process_speech(data: SpeechInput):

    prompt = f"""
{SYSTEM_PROMPT}

User said:
"{data.speechText}"
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        ai_text = response.text.strip()

        # SAFER than eval
        parsed = json.loads(ai_text)

        return parsed

    except Exception as e:
        print("❌ Gemini Error:", e)

        return {
            "reply": "Sorry, I did not understand that. Could you please repeat?",
            "complete": False
        }
