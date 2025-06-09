# Banking Chatbot

This is a Node.js/Express chatbot that uses the OpenAI API and a custom knowledge base (`banking_sok.docx`) to answer banking-related questions. The frontend is a simple HTML/JS app that communicates with the backend via REST API.

---

## Features

- Uses OpenAI GPT-4o with file search for banking knowledge
- Answers questions about company policies, account types, cycles, FAQs, and more
- Simple web frontend for chat
- Easily extensible with your own documents

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/darkendord/cat_chat_bot.git
cd OpenAITest/server
```

### 2. Install dependencies

```sh
npm install
```

### 3. Add your OpenAI API key

Create a `.env` file in the `server` folder:

```
OPENAI_API_KEY=sk-...
```

### 4. Add your knowledge base

Place your `banking_sok.docx` file in the `server` directory.

### 5. Start the server

```sh
npm start
```

The server will run at [http://localhost:8080](http://localhost:8080).

### 6. Open the client

Open `client/index.html` in your browser, or visit your deployed frontend.

---

## Project Structure

```
server/
  index.js         # Express backend
  functions.js     # OpenAI vector store setup
  .env             # API key (not committed)
  assistant.json   # Stores vector store ID
  banking_sok.docx # Your knowledge base
  package.json
client/
  index.html       # Chat UI
  script.js        # Frontend logic
```

---

## Deployment

You can deploy this bot for free on platforms like [Render](https://render.com/), [Railway](https://railway.app/), or [Cyclic](https://cyclic.sh/).  
Remember to set your `OPENAI_API_KEY` as an environment variable on your chosen platform.

---

## Security

- **Never commit your `.env` file or API keys to public repositories.**
- `.env` and `node_modules/` are already in `.gitignore`.

---

## License

MIT

---

## Credits

- [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- [Express](https://expressjs.com/)
