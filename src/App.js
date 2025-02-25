import React, { useState, useEffect } from 'react';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage } from '@langchain/core/messages';
import dayjs from 'dayjs';

// Componentes
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

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
  const [selectedModel, setSelectedModel] = useState('deepseek-r1-distill-qwen-32b');
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

  // Modelos disponíveis
  const models = [
    { name: 'Llama3', value: 'llama3-70b-8192' },
    { name: 'qwen-coder', value: 'qwen-2.5-coder-32b' },
    { name: 'deepseek', value: 'deepseek-r1-distill-qwen-32b' }
  ];

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
      name: 'Nova Conversa',
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

  // Envia mensagem do usuário e obtém resposta
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);

      // Mensagem do usuário
      const userMessage = new HumanMessage(inputMessage);
      const updatedMessages = [...messages, { type: 'human', content: inputMessage }];

      // Chama a API do Groq
      const groq = new ChatGroq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
        model: selectedModel
      });

      // Resposta da IA
      const response = await groq.invoke([userMessage]);
      const finalMessages = [
        ...updatedMessages,
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
          // Em vez de usar cor fixa, vamos usar o background default do tema
          backgroundColor: 'background.default'
        }}
      >
        {/* Sidebar (lista de conversas) */}
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
          // Props para tema
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Conteúdo principal: Mensagens e Input */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatWindow messages={messages} models={models} />
          <ChatInput
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            models={models}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isLoading={isLoading}
            handleSendMessage={handleSendMessage}
          />
        </Box>

        {/* Diálogo de confirmar exclusão */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Tem certeza que deseja excluir esta conversa?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button
              color="error"
              onClick={() => {
                deleteConversation(conversationToDelete);
                setDeleteDialogOpen(false);
              }}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de renomear */}
        <Dialog
          open={renameDialogOpen}
          onClose={() => setRenameDialogOpen(false)}
        >
          <DialogTitle>Renomear Conversa</DialogTitle>
          <Box sx={{ p: 3, minWidth: 400 }}>
            <TextField
              fullWidth
              autoFocus
              label="Novo nome"
              value={newConversationName}
              onChange={(e) => setNewConversationName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && renameConversation()}
            />
          </Box>
          <DialogActions>
            <Button onClick={() => setRenameDialogOpen(false)}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={renameConversation}
              disabled={!newConversationName.trim()}
            >
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default App;