import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@mui/material/styles';

const ChatWindow = ({ messages, models }) => {
  const theme = useTheme();

  // Função para processar o conteúdo e aplicar estilo ao texto dentro de <think>
  const processThinkTags = (content) => {
    const parts = content.split(/(<think>.*?<\/think>)/gs);
    return parts.map((part, index) => {
      const thinkMatch = part.match(/<think>(.*?)<\/think>/s);
      if (thinkMatch) {
        return (
          <span key={index} style={{ opacity: 0.6 }}>
            {thinkMatch[1]}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        overflowY: 'auto'
      }}
    >
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            mb: 2
          }}
        >
          <Box
            sx={{
              maxWidth: '60%',
              bgcolor: msg.role === 'user' 
                ? 'primary.main' 
                : theme.palette.mode === 'dark' 
                  ? '#1a3d2c' // Tom de verde escuro para modo escuro
                  : '#e8f5e9', // Tom de verde claro para modo claro
              color: msg.role === 'user' 
                ? 'primary.contrastText' 
                : 'text.primary',
              p: 2,
              borderRadius: 2,
              position: 'relative',
              boxShadow: 1,
              '&:after': {
                content: '""',
                position: 'absolute',
                width: 0,
                height: 0,
                [msg.role === 'user' ? 'right' : 'left']: -10,
                top: 12,
                borderStyle: 'solid',
                borderWidth: '8px 12px 8px 0',
                borderColor: msg.role === 'user'
                  ? `transparent ${theme.palette.primary.main} transparent transparent`
                  : theme.palette.mode === 'dark'
                    ? `transparent #1a3d2c transparent transparent`
                    : `transparent #e8f5e9 transparent transparent`,
                transform: msg.role === 'user' ? 'rotate(180deg)' : 'none'
              }
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => {
                  return <p>{processThinkTags(children.toString())}</p>;
                },
                strong: ({ node, ...props }) => (
                  <strong style={{ fontWeight: 600 }} {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em style={{ fontStyle: 'italic' }} {...props} />
                ),
                code: ({ node, inline, ...props }) => (
                  <code
                    style={{
                      background: msg.role === 'user' 
                        ? '#ffffff30' 
                        : theme.palette.mode === 'dark'
                          ? '#ffffff10'
                          : '#00000010',
                      padding: '2px 4px',
                      borderRadius: 4,
                      fontFamily: 'monospace'
                    }}
                    {...props}
                  />
                )
              }}
            >
              {msg.content}
            </ReactMarkdown>

            {/* Show model name only for AI messages */}
            {msg.role !== 'user' && msg.model && (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mt: 1,
                  color: 'text.secondary'
                }}
              >
                Model: {models.find((m) => m.value === msg.model)?.name}
              </Typography>
            )}

            {/* Error message */}
            {msg.type === 'error' && (
              <Typography variant="caption" color="error">
                An error occurred. Please try again.
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChatWindow;
