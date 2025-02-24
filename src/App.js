import React, { useState, useEffect } from 'react';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage } from '@langchain/core/messages';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  Paper,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import { Delete, Add, Edit, Send } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import dayjs from 'dayjs';
import './theme.css';

// Estrutura do histórico de conversas
const initialConversations = JSON.parse(localStorage.getItem('chatHistory') || '[]');

const App = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('deepseek-r1-distill-qwen-32b');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState(null);
  const [newConversationName, setNewConversationName] = useState('');

  const models = [
    { name: 'Llama3', value: 'llama3-70b-8192' },
    { name: 'qwen-coder', value: 'qwen-2.5-coder-32b' },
    { name: 'deepseek', value: 'deepseek-r1-distill-qwen-32b' }

  ];

  // Salvar no localStorage sempre que conversations mudar
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(conversations));
  }, [conversations]);

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      name: 'Nova Conversa',
      messages: [],
      model: selectedModel,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
  };

  const selectConversation = (id) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(id);
      setSelectedModel(conversation.model);
    }
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      createNewConversation();
    }
  };

  const renameConversation = () => {
    if (!newConversationName.trim()) return;

    setConversations(prev => prev.map(c => {
      if (c.id === conversationToRename) {
        return {
          ...c,
          name: newConversationName.trim()
        };
      }
      return c;
    }));

    setRenameDialogOpen(false);
    setNewConversationName('');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      const userMessage = new HumanMessage(inputMessage);

      // Atualizar conversa atual
      const updatedMessages = [...messages, { type: 'human', content: inputMessage }];

      const groq = new ChatGroq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
        model: selectedModel,
      });

      const response = await groq.invoke([userMessage]);

      const finalMessages = [...updatedMessages, {
        type: 'ai',
        content: response.content,
        model: selectedModel
      }];

      // Atualizar histórico
      setConversations(prev => prev.map(c => {
        if (c.id === currentConversationId) {
          return {
            ...c,
            messages: finalMessages,
            model: selectedModel,
            timestamp: new Date().toISOString(),
            name: inputMessage.substring(0, 20) + (inputMessage.length > 20 ? '...' : '')
          };
        }
        return c;
      }));

      setMessages(finalMessages);
      setInputMessage('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Ocorreu um erro. Por favor, tente novamente.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" disableGutters sx={{
      height: '100vh',
      display: 'flex',
      gap: 2,
      bgcolor: '#f5f5f5',
    }}>

      {/* Sidebar */}
      <Paper sx={{ width: 200, p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* <Typography variant="h4" sx={{ fontWeight: 600 }}>Groqlin AI</Typography> */}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="#666666">Conversas</Typography>
          <IconButton onClick={createNewConversation}>
            <Add />
          </IconButton>
        </Box>
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {conversations.map(conversation => (
            <ListItem
              key={conversation.id}
              selected={conversation.id === currentConversationId}
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                borderRadius: 1
              }}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConversationToRename(conversation.id);
                      setNewConversationName(conversation.name);
                      setRenameDialogOpen(true);
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConversationToDelete(conversation.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={conversation.name}
                secondary={dayjs(conversation.timestamp).format('DD/MM/YY HH:mm')}
                onClick={() => selectConversation(conversation.id)}
              />
            </ListItem>
          ))}
        </List>
      </Paper>


      {/* Chat Messages */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{
            display: 'flex',
            gap: 3.5,
            flexDirection: msg.type === 'human' ? 'row-reverse' : 'row'
          }}>
            <Box sx={{
              maxWidth: '60%',
              bgcolor: msg.type === 'human' ? '#1976d2' : '#e8f5e9',
              color: msg.type === 'human' ? 'white' : 'text.primary',
              p: 1.5,
              borderRadius: 6,
              marginBottom: 2,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: 0,
                height: 0,
                [msg.type === 'human' ? 'right' : 'left']: -8,
                top: 12,
                borderStyle: 'solid',
                borderWidth: '8px 12px 8px 0',
                borderColor: msg.type === 'human'
                  ? `transparent #1976d2 transparent transparent`
                  : `transparent #e8f5e9 transparent transparent`,
                transform: msg.type === 'human' ? 'rotate(180deg)' : 'none'
              }
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                strong: ({ node, ...props }) => <strong style={{ fontWeight: 600 }} {...props} />,
                em: ({ node, ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,
                code: ({ node, inline, ...props }) => (
                  <code style={{
                    background: '#ffffff30',
                    padding: '2px 4px',
                    borderRadius: 6,
                    fontFamily: 'monospace'
                  }} {...props} />
                )
              }}>
                {msg.content}
              </ReactMarkdown>
              {msg.type === 'ai' && (
                <Typography variant="caption" color="text.secondary">
                  Modelo: {models.find(m => m.value === msg.model)?.name}
                </Typography>
              )}
            </Box>
          </Box>
        ))}


        {/* ChatInput */}
        <Box sx={{
          position: 'sticky',
          bottom: 0,
          background: 'white',
          zIndex: 1,
          borderTop: '1px solid #e0e0e0',
          pt: 2,
          pb: 2,
          width: '100%'
        }}>
          <Box sx={{ position: 'relative', display: 'flex', gap: 1 }}>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              size="small"
              sx={{ width: 140 }}
            >
              {models.map((model) => (
                <MenuItem key={model.value} value={model.value}>
                  {model.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Enviar mensagem"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 20,
                  bgcolor: 'background.paper'
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              sx={{
                borderRadius: 20,
                minWidth: 100,
                textTransform: 'none'
              }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Diálogos */}
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
            onClick={renameConversation}
            variant="contained"
            disabled={!newConversationName.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container >
  );
};

export default App;