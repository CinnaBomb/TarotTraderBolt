import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json(cardData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate card' });
  }
}