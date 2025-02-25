# Groqlin

Intelligent chatbot web application supporting multiple language models (LLMs) via the Groq API, developed with React.js and LangChain.

## ✨ Features

- 🧠 Conversation with state-of-the-art AI models
- 🔄 Real-time model switching (Mixtral, Llama2, Gemma)
- 💾 Conversation history with local storage
- ✏️ Rename saved conversations
- 🎨 Responsive and modern interface with Material UI
- 🛑 Error handling and loading states
- ⚙️ Simple configuration via a .env file

## 🐳 Docker Setup

Follow these steps to build and run the Docker container for Groqlin:

1. **Build the Docker Image**

   ```bash
   docker compose up -d
   ```

## 📋 Prerequisites

- Node.js >= 18.15.0
- npm >= 9.5.0
- Groq API Key (register at [console.groq.com](https://console.groq.com))

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone 
   cd Groqlin
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the `.env` file in the project's root:

   ```env
   REACT_APP_GROQ_API_KEY=your_key_here
   ```

4. Start the application:

   ```bash
   npm start
   ```

   The application will be available at: [http://localhost:3000](http://localhost:3000)

## 🖥 How to Use

### New Conversation

- Click the "+" button in the sidebar to start a new conversation

### Send Message

- Type your message in the text field
- Press Enter or click the "Send" button

### Switch Model

- Select the desired model from the top dropdown

### Manage Conversations

- ✏️ Click the pencil icon to rename
- 🗑️ Click the trash icon to delete
- 💾 History is automatically saved in localStorage

### `.env` Configuration

Create a `.env` file in the project's root with the following content:

```env
REACT_APP_GROQ_API_KEY=your_groq_key_here
```

**Important:** Never share or commit this file!

## 🔧 Technologies Used

- React.js
- LangChain
- Groq API
- Material UI
- Day.js

## 🔍 Tips

To obtain a Groq API key:

- Visit [console.groq.com](https://console.groq.com)
- Create a free account
- Generate a new key in "API Keys"
- Keep your API key secure
- Try different models to compare responses

## ⚠️ Troubleshooting

### Error: "Missing API Key"

- Ensure that the `.env` file exists in the project's root
- Verify that the variable name is correct: `REACT_APP_GROQ_API_KEY`

### Error: "Invalid API Key"

- Generate a new key from the Groq console
- Update the `.env` file

### Installation Errors

Clear the npm cache:

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## 🤝 Contribution

Contributions are welcome! Follow these steps:

1. Fork the project
2. Create a branch for your feature:

   ```bash
   git checkout -b feature/amazing
   ```

3. Commit your changes:

   ```bash
   git commit -m 'Add amazing feature'
   ```

4. Push to your branch:

   ```bash
   git push origin feature/amazing
   ```

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

**Note:** This project is for educational/demonstration purposes. For production environments, it is recommended to implement a backend to securely manage API keys.