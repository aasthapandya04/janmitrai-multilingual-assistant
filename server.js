const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set. The API proxy will return an error if called.');
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/gemini', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in .env.' });
  }

  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing request payload.' });
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data?.error?.message || `Gemini API error: ${response.status}`;
      return res.status(response.status).json({ error: errorMessage });
    }

    res.json(data);
  } catch (error) {
    console.error('Gemini proxy error:', error);
    res.status(500).json({ error: 'Unable to contact Gemini API. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`JanMitra AI backend proxy running on http://localhost:${port}`);
});
