import React from 'react';
import { Box, Select, MenuItem, TextField, Button } from '@mui/material';
import { Send } from '@mui/icons-material';

const ChatInput = ({
  selectedModel,
  setSelectedModel,
  models,
  inputMessage,
  setInputMessage,
  isLoading,
  handleSendMessage
}) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        background: '#fff',
        borderTop: '1px solid #ddd',
        p: 2
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Selecionar modelo */}
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

        {/* Campo de texto */}
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
              borderRadius: 20
            }
          }}
        />

        {/* Botão de enviar */}
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
  );
};

export default ChatInput;
