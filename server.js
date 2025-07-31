// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Debug: Show if API key is loaded
console.log("Loaded API key:", process.env.PERPLEXITY_API_KEY ? "✅ Yes" : "❌ No");

// API Route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'The "messages" field must be a non-empty array.' });
    }

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-small-chat", // 👈 FIXED: Use full model name
        messages: messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("🔥 API Error:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Conversly backend is running on http://localhost:${port}`);
});
