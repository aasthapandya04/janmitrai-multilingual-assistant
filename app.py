from flask import Flask, request
from services.extractor import extract_info
import random

app = Flask(__name__)

@app.route("/")
def home():
    return """
    <h1>🇮🇳 JanMitra AI</h1>

    <h3>Multilingual Complaint Assistant</h3>

    <form action="/complaint">

        <input
            type="text"
            name="text"
            placeholder="Enter your complaint"
            style="width:400px;height:35px;"
        >

        <br><br>

        <button type="submit">
            Submit Complaint
        </button>

    </form>
    """


@app.route("/complaint")
def complaint():

    # Get user input
    user_text = request.args.get("text", "")

    # Convert to lowercase for checking
    text = user_text.lower()

    # Extract information
    info = extract_info(user_text)

    # -------------------------
    # Category Detection
    # -------------------------

    category = "General"

    if "wifi" in text or "internet" in text:
        category = "IT Support"

    elif "hostel" in text or "mess" in text:
        category = "Hostel"

    elif "water" in text or "pani" in text:
        category = "Water Supply"

    elif "electricity" in text or "light" in text:
        category = "Electricity"

    # -------------------------
    # Department Routing
    # -------------------------

    department = "General Department"

    if category == "IT Support":
        department = "IT Cell"

    elif category == "Hostel":
        department = "Hostel Management"

    elif category == "Water Supply":
        department = "Water Department"

    elif category == "Electricity":
        department = "Electrical Department"

    # -------------------------
    # Priority Detection
    # -------------------------

    priority = "Low"

    if "urgent" in text:
        priority = "High"

    elif "danger" in text:
        priority = "High"

    elif "shock" in text:
        priority = "High"

    elif "5 din" in text:
        priority = "Medium"

    elif "3 din" in text:
        priority = "Medium"

    elif "2 din" in text:
        priority = "Medium"

    # -------------------------
    # Ticket ID
    # -------------------------

    ticket_id = "CMP-" + str(random.randint(1000, 9999))

    # -------------------------
    # English Complaint
    # -------------------------

    english_complaint = f"""
Subject: Complaint Regarding {category}

Respected Sir/Madam,

I would like to report the following issue:

{user_text}

Kindly look into this matter and resolve it as soon as possible.

Thank you.

Regards,
Citizen
"""

    # -------------------------
    # Hindi Complaint
    # -------------------------

    hindi_complaint = f"""
विषय: {category} से संबंधित शिकायत

महोदय/महोदया,

मैं निम्नलिखित समस्या की शिकायत दर्ज कराना चाहता/चाहती हूँ:

{user_text}

कृपया इस समस्या का शीघ्र समाधान करने की कृपा करें।

धन्यवाद।

सादर,
नागरिक
"""

    return f"""
    <h1>JanMitra AI Result</h1>

    <hr>

    <p><b>Ticket ID:</b> {ticket_id}</p>

    <p><b>Original Complaint:</b> {user_text}</p>

    <p><b>Category:</b> {category}</p>

    <p><b>Extracted Issue:</b> {info['issue']}</p>

    <p><b>Duration:</b> {info['duration']}</p>

    <p><b>Department:</b> {department}</p>

    <p><b>Priority:</b> {priority}</p>

    <hr>

    <h2>English Complaint</h2>

    <pre>{english_complaint}</pre>

    <hr>

    <h2>हिंदी शिकायत</h2>

    <pre>{hindi_complaint}</pre>
    """


if __name__ == "__main__":
    app.run(debug=True)