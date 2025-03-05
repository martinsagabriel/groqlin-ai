import React, { useState, useEffect } from 'react';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage } from '@langchain/core/messages';

// Componentes
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SidebarToggle from './components/SidebarToggle';
import ParametersSidebar from './components/ParametersSidebar';
import ParametersToggle from './components/ParametersToggle';

// MUI
import {
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  createTheme,
  ThemeProvider,
  CssBaseline 
} from '@mui/material';


// Estilos globais
import './theme.css';

// Carrega histórico do localStorage
const initialConversations = JSON.parse(localStorage.getItem('chatHistory') || '[]');

// Carrega preferência de tema do localStorage (se existir)
const storedDarkMode = localStorage.getItem('darkMode') === 'true';

const App = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [isLoading, setIsLoading] = useState(false);

  // Histórico de conversas
  const [conversations, setConversations] = useState(initialConversations);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Diálogo de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);

  // Diálogo de renomear
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState(null);
  const [newConversationName, setNewConversationName] = useState('');

  // Tema claro/escuro
  const [isDarkMode, setIsDarkMode] = useState(storedDarkMode);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Add new state for parameters sidebar
  const [parametersOpen, setParametersOpen] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [maxTokens, setMaxTokens] = useState(1024);

  // Modelos disponíveis
  const models = [
    { name: 'Llama 3.3', value: 'llama-3.3-70b-versatile' },
    { name: 'Qwen Coder', value: 'qwen-2.5-coder-32b' },
    { name: 'Deepseek-R1', value: 'deepseek-r1-distill-qwen-32b' },
    { name: 'Gemma2', value: 'deepseek-coder-32b' },
    { name: 'Whisper', value: 'whisper-large-v3' },
    { name: 'Whisper Turbo', value: 'whisper-large-v3-turbo' },
    { name: 'Qwen 2.5', value: 'qwen-2.5-32b' },
  ];

  // Adiciona estado para o system prompt
  const [systemPrompt, setSystemPrompt] = useState('');
  const [systemPromptDialogOpen, setSystemPromptDialogOpen] = useState(false);

  // Atualiza localStorage sempre que o array de conversas mudar
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(conversations));
  }, [conversations]);

  // Salva preferência de tema sempre que isDarkMode mudar
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Cria tema de acordo com isDarkMode
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light'
    }
  });

  // Cria uma nova conversa e a seleciona
  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      name: 'New Chat',
      messages: [],
      model: selectedModel,
      timestamp: new Date().toISOString()
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  // Seleciona uma conversa pelo ID
  const selectConversation = (id) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(id);
      setSelectedModel(conversation.model);
    }
  };

  // Deleta uma conversa
  const deleteConversation = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    // Se estava na conversa deletada, cria uma nova
    if (currentConversationId === id) {
      createNewConversation();
    }
  };

  // Renomeia a conversa atual
  const renameConversation = () => {
    if (!newConversationName.trim()) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationToRename) {
          return { ...c, name: newConversationName.trim() };
        }
        return c;
      })
    );
    setRenameDialogOpen(false);
    setNewConversationName('');
  };

  // Modifica a função handleSendMessage para incluir o system prompt
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);

      // Mensagens para enviar à API
      const messages = [];
      
      // Adiciona system prompt se existir
      if (systemPrompt.trim()) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      
      // Adiciona mensagem do usuário
      messages.push({ role: 'user', content: inputMessage });

      // Chama a API do Groq
      const groq = new ChatGroq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
        model: selectedModel,
        temperature: temperature,
        maxTokens: maxTokens,
      });

      // Resposta da IA
      const response = await groq.invoke(messages);
      const finalMessages = [
        ...messages,
        {
          type: 'ai',
          content: response.content,
          model: selectedModel
        }
      ];

      // Atualiza a conversa no array de conversas
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConversationId) {
            return {
              ...c,
              messages: finalMessages,
              model: selectedModel,
              timestamp: new Date().toISOString(),
              // Usar parte da mensagem como título da conversa
              name:
                inputMessage.substring(0, 20) +
                (inputMessage.length > 20 ? '...' : '')
            };
          }
          return c;
        })
      );

      setMessages(finalMessages);
      setInputMessage('');
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'error',
          content: 'Ocorreu um erro. Por favor, tente novamente.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline garante que o background e cores do MUI sejam aplicados */}
      <CssBaseline />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: '100vh',
          display: 'flex',
          backgroundColor: 'background.default',
          position: 'relative'
        }}
      >
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            createNewConversation={createNewConversation}
            selectConversation={selectConversation}
            setConversationToRename={setConversationToRename}
            setNewConversationName={setNewConversationName}
            setRenameDialogOpen={setRenameDialogOpen}
            setConversationToDelete={setConversationToDelete}
            setDeleteDialogOpen={setDeleteDialogOpen}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        )}

        {/* Botão de toggle da sidebar */}
        <SidebarToggle
          isOpen={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Parameters sidebar and toggle */}
        <ParametersSidebar
          isOpen={parametersOpen}
          onClose={() => setParametersOpen(false)}
          temperature={temperature}
          setTemperature={setTemperature}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
        />
        
        <ParametersToggle
          isOpen={parametersOpen}
          onClick={() => setParametersOpen(!parametersOpen)}
        />

        {/* Conteúdo principal */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: sidebarOpen ? '250px' : 0,
          marginRight: parametersOpen ? '250px' : 0,
          transition: 'margin 0.3s ease'
        }}>
          <ChatWindow messages={messages} models={models} />
          <ChatInput
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            models={models}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isLoading={isLoading}
            handleSendMessage={handleSendMessage}
            systemPrompt={systemPrompt}
            onSystemPromptClick={() => setSystemPromptDialogOpen(true)}
          />
        </Box>

        {/* Diálogo de confirmar exclusão */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Are you sure you want to delete this chat?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                deleteConversation(conversationToDelete);
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de renomear */}
        <Dialog
          open={renameDialogOpen}
          onClose={() => setRenameDialogOpen(false)}
        >
          <DialogTitle>Rename Chat</DialogTitle>
          <Box sx={{ p: 3, minWidth: 400 }}>
            <TextField
              fullWidth
              autoFocus
              label="New name"
              value={newConversationName}
              onChange={(e) => setNewConversationName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && renameConversation()}
            />
          </Box>
          <DialogActions>
            <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={renameConversation}
              disabled={!newConversationName.trim()}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo do System Prompt */}
        <Dialog
          open={systemPromptDialogOpen}
          onClose={() => setSystemPromptDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Configure System Prompt</DialogTitle>
          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="System Prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Ex: You are an assistant specialized in Python programming..."
              helperText="Defines how the model should behave when responding"
            />
          </Box>
          <DialogActions>
            <Button onClick={() => setSystemPromptDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => setSystemPromptDialogOpen(false)}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default App;