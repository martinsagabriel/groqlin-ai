import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@mui/material/styles';
import ScrollToBottomButton from './ScrollToBottomButton';

const ChatWindow = ({ messages, models }) => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Monitora o scroll para mostrar/esconder o botão
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const bottomThreshold = 100; // pixels do fundo
    const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
    
    setShowScrollButton(!isNearBottom);
  };

  // Função para rolar até o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Adiciona listener de scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Rola automaticamente para baixo quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      ref={containerRef}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        overflowY: 'auto',
        position: 'relative'
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
              maxWidth: {
                xs: '85%', // Em dispositivos móveis
                sm: '75%', // Em tablets
                md: '60%'  // Em desktops
              },
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

      {/* Referência para o final das mensagens */}
      <div ref={messagesEndRef} />

      {/* Componente do botão de scroll */}
      <ScrollToBottomButton 
        show={showScrollButton} 
        onClick={scrollToBottom} 
      />
    </Box>
  );
};

export default ChatWindow;
