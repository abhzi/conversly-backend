import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

app.use(cors());
app.use(bodyParser.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Conversly backend is up and running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "mistral-7b-instruct", // You can replace with "llama-3-sonar-small-32k-online"
        messages: req.body.messages,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Perplexity API error:", err.response?.data || err.message);
    res.status(500).json({ error: "API call failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Conversly backend is running on http://localhost:${PORT}`);
});
