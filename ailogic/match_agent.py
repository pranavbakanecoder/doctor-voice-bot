def match_agent(user_text: str):
    text = user_text.lower()

    if "appointment" in text:
        return {
            "intent": "BOOK_APPOINTMENT",
            "reply": "Sure, I can help you book an appointment. Please tell me the date."
        }

    if "hello" in text or "hi" in text:
        return {
            "intent": "GREETING",
            "reply": "Hello! How can I help you today?"
        }

    return {
        "intent": "UNKNOWN",
        "reply": "Sorry, I didn’t understand that. Can you rephrase?"
    }
