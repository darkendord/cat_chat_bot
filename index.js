require('dotenv').config();
const express = require('express');
const { OpenAI } = require('openai');
const { createAssistant } = require('./functions');

const cors = require('cors'); 

// Initialize Express app
const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));
// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Updated to apiKey
});

// Create or load assistant
let vectorStoreId;
(async () => {
  const ids = await createAssistant(client);
  vectorStoreId = ids.vectorStoreId;
})();

// Start conversation thread
app.get('/start', (req, res) => {
  // Generate a random session ID (for your own tracking, not OpenAI)
  const sessionId = `session_${Math.random().toString(36).slice(2, 11)}`;
  res.json({ session_id: sessionId });
});

// Example: Create a response (replaces thread/message/run)
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const response = await client.responses.create({
      instructions: `
        The Banking Customer Support Assistant is designed for bank employees and customer service agents to provide accurate and efficient support for customer queries. It uses the Source Of Knowledge (SOK) document to answer questions about company policies, products and services, account cycles, FAQs, technical help, process flows, glossary, contact directory, and quick reference charts. The assistant supports keyword-based searches (e.g., "cycle B", "fraud", "reset password") and provides concise, professional responses. Include relevant details such as contact information, step-by-step guides, or table data when applicable. Suggest downloadable resources (e.g., PDFs) or related sections when relevant.
      `,
      model: 'gpt-4o',
      tools: [{
        type: 'file_search',
        vector_store_ids: [vectorStoreId],
      }],
      input: message,
    });

    // Use output_text from the response
    const outputText = response.output_text;
    console.log('OpenAI response:', response);

    if (!outputText) {
      return res.status(500).json({ error: "OpenAI did not return a valid result." });
    }

    const structuredResponse = {
      response: outputText,
      metadata: {
        related_resources: [
          { type: 'pdf', name: 'Company Policies', url: '/resources/policies.pdf' },
          { type: 'pdf', name: 'Account Types Guide', url: '/resources/account_types.pdf' },
        ],
        related_sections: ['Company Policies', 'FAQs', 'Quick Reference Charts'],
      },
    };

    res.json(structuredResponse);
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

// Start server
app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:8080');
});