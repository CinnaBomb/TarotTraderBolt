import { OpenAI } from 'openai';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-card', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a mystical tarot card creator. Generate a unique tarot card based on the user's description. Include a name, suit (Major Arcana, Wands, Cups, Swords, or Pentacles), meaning, and description."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    // Parse the AI response into structured data
    const cardData = {
      name: response.match(/Name: (.*?)\\n/)?.[1] || '',
      suit: response.match(/Suit: (.*?)\\n/)?.[1] || '',
      meaning: response.match(/Meaning: (.*?)\\n/)?.[1] || '',
      description: response.match(/Description: (.*?)$/s)?.[1] || ''
    };

    res.json(cardData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate card' });
  }
});

export const handler = app;