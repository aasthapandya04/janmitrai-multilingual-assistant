# JanMitra AI 🇮🇳

### AI-Powered Multilingual Citizen Services Platform

JanMitra AI is an intelligent citizen assistance platform designed to simplify interactions between Indian citizens and government services.

Powered by Google Gemini AI, the platform helps users:

* Generate professional government complaints
* Get assistance with government forms
* Understand policies and schemes in simple language
* Route support requests to the correct department
* Access government resources and documentation

The platform supports Hindi, Hinglish, and English, making government services more accessible to everyone.

---

## Features

### Complaint Generator

Generate professional bilingual complaints using AI.

* Hindi, Hinglish, and English input
* Automatic department identification
* Complaint categorization
* Priority assessment
* Unique ticket generation
* PDF-ready complaint format

### Government Form Assistant

Get help understanding and filling government forms.

* Step-by-step guidance
* Document checklist support
* Simplified explanations
* Multilingual assistance

### Policy Explainer

Understand government policies and schemes easily.

* Scheme explanations
* Eligibility guidance
* Benefit descriptions
* Simplified language summaries

### Support Routing

Automatically identify the correct department.

* Department detection
* Issue classification
* Government routing recommendations

### Resources Hub

Access important citizen resources.

* Government schemes
* Student resources
* FAQs
* Helplines
* Documentation
* User guides

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### AI Integration

* Google Gemini 2.5 Flash

### Environment Management

* dotenv

---

## Project Structure

```text
JanMitra-AI/
│
├── index.html
├── workflow.html
├── assistant.html
├── resources.html
├── results.html
│
├── css/
│   ├── style.css
│   ├── home.css
│   ├── assistant.css
│   ├── workflow.css
│   ├── resources.css
│   └── results.css
│
├── js/
│   └── scripts
│
├── server.js
├── package.json
├── .env
├── .gitignore
│
└── assets/
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/janmitra-ai.git
cd janmitra-ai
```

Install dependencies

```bash
npm install
```

Create a .env file

```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3000
```

Start the server

```bash
npm start
```

Open in browser

```text
http://localhost:3000
```

---

## Pages

### Home Page

Landing page introducing JanMitra AI and its capabilities.

### Services Page

Select among:

* Complaint Filing
* Form Assistance
* Policy Explainer
* Support Routing

### AI Assistant

Interactive Gemini-powered assistant for citizen support.

### Resources Hub

Government schemes, FAQs, guides, and documentation.

### Results Page

Displays generated complaint details including:

* Ticket ID
* Department
* Priority
* English Complaint
* Hindi Complaint
* Download Options

---

## Security

* Gemini API key stored securely on the backend
* API requests routed through Express proxy
* No API keys exposed in the browser
* Environment variables managed using dotenv

---

## Future Enhancements

* Voice-based complaint filing
* OCR document scanning
* Regional language support
* Government portal integration
* Complaint tracking dashboard
* Mobile application
* WhatsApp integration

---

## Use Cases

* Citizen grievance filing
* Government service guidance
* Scheme awareness
* Educational assistance
* Department routing
* Public service accessibility

---

## License

This project is developed for educational, innovation, and hackathon purposes.

---

## Team

Developed as part of an AI-driven citizen service initiative to improve accessibility, transparency, and efficiency in government interactions.
