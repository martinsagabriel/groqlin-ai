import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import { Send, Settings } from '@mui/icons-material';

const ChatInput = ({
  selectedModel,
  setSelectedModel,
  models,
  inputMessage,
  setInputMessage,
  isLoading,
  handleSendMessage,
  systemPrompt,
  onSystemPromptClick
}) => {
  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        gap: 1,
        flexDirection: {
          xs: 'column',
          sm: 'row'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        width: { xs: '100%', sm: 'auto' }
      }}>
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: { xs: '50%', sm: 150 }
          }}
        >
          <InputLabel>Model</InputLabel>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            label="Model"
          >
            {models.map((model) => (
              <MenuItem key={model.value} value={model.value}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="System Prompt">
          <IconButton
            onClick={onSystemPromptClick}
            color={systemPrompt ? "primary" : "default"}
          >
            <Settings />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 1,
        width: '100%'
      }}>
        <TextField
          fullWidth
          size="small"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />

        <IconButton
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          color="primary"
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInput;
