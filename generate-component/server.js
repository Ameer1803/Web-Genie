// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { main as generateFromLLM } from "./githubai.js"; // Your function above

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-component", async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await generateFromLLM(prompt);
    res.json({ code: result.code });
  } catch (err) {
    console.error("LLM generation error:", err);
    res.status(500).json({ error: "Generation failed." });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
