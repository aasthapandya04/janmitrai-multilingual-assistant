def extract_info(text):

    text = text.lower()

    info = {
        "issue": "Unknown",
        "duration": "Not Mentioned"
    }

    # Issue Detection

    if "wifi" in text or "internet" in text:
        info["issue"] = "WiFi Issue"

    elif "pani" in text or "water" in text:
        info["issue"] = "Water Supply Issue"

    elif "light" in text or "electricity" in text:
        info["issue"] = "Electricity Issue"

    elif "hostel" in text:
        info["issue"] = "Hostel Issue"

    elif "mess" in text:
        info["issue"] = "Mess Issue"

    # Duration Detection

    if "5 din" in text:
        info["duration"] = "5 Days"

    elif "4 din" in text:
        info["duration"] = "4 Days"

    elif "3 din" in text:
        info["duration"] = "3 Days"

    elif "2 din" in text:
        info["duration"] = "2 Days"

    elif "1 din" in text:
        info["duration"] = "1 Day"

    return info