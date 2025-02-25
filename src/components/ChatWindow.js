import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatWindow = ({ messages, models }) => {
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
            flexDirection: msg.type === 'human' ? 'row-reverse' : 'row',
            mb: 2
          }}
        >
          <Box
            sx={{
              maxWidth: '60%',
              bgcolor: msg.type === 'human' ? '#1976d2' : '#e8f5e9',
              color: msg.type === 'human' ? '#fff' : 'text.primary',
              p: 1.5,
              borderRadius: 2,
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
                  ? 'transparent #1976d2 transparent transparent'
                  : 'transparent #e8f5e9 transparent transparent',
                transform: msg.type === 'human' ? 'rotate(180deg)' : 'none'
              }
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                strong: ({ node, ...props }) => (
                  <strong style={{ fontWeight: 600 }} {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em style={{ fontStyle: 'italic' }} {...props} />
                ),
                code: ({ node, inline, ...props }) => (
                  <code
                    style={{
                      background: '#ffffff30',
                      padding: '2px 4px',
                      borderRadius: 6,
                      fontFamily: 'monospace'
                    }}
                    {...props}
                  />
                )
              }}
            >
              {msg.content}
            </ReactMarkdown>

            {/* Se for mensagem da IA, exibir o modelo usado */}
            {msg.type === 'ai' && (
              <Typography variant="caption" color="text.secondary">
                Modelo: {models.find((m) => m.value === msg.model)?.name}
              </Typography>
            )}

            {/* Se houver erro */}
            {msg.type === 'error' && (
              <Typography variant="caption" color="error">
                {msg.content}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChatWindow;
