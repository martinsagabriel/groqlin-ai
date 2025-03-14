import React from 'react';
import {
    Paper,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { Add, Edit, Delete, DarkMode, LightMode } from '@mui/icons-material';
import dayjs from 'dayjs';

const Sidebar = ({
    conversations,
    currentConversationId,
    createNewConversation,
    selectConversation,
    setConversationToRename,
    setNewConversationName,
    setRenameDialogOpen,
    setConversationToDelete,
    setDeleteDialogOpen,
    isDarkMode,
    setIsDarkMode,
}) => {
    return (
        <Paper
            sx={{
                width: { xs: '100%', sm: 250 },
                height: '100%',
                position: 'fixed',
                left: 0,
                top: 0,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                zIndex: 1200
            }}
            elevation={0}
        >
            {/* Toggle de tema (claro/escuro) */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    justifyContent: 'center'
                }}
            >
                <IconButton onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
            </Box>

            {/* Título e botão de nova conversa */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                {/* <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Chats
                </Typography> */}
                <IconButton onClick={createNewConversation}>
                    <Add />
                </IconButton>
            </Box>


            {/* Lista de conversas */}
            <List sx={{ flex: 1, overflowY: 'auto' }}>
                {conversations.map((conversation) => (
                    <ListItem
                        key={conversation.id}
                        selected={conversation.id === currentConversationId}
                        onClick={() => selectConversation(conversation.id)}
                        sx={{
                            cursor: 'pointer',
                            borderRadius: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                                bgcolor: 'action.selected'
                            },
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                        secondaryAction={
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {/* Botão de renomear */}
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
                                {/* Botão de excluir */}
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
                        />
                    </ListItem>
                ))}
            </List>

        </Paper>
    );
};

export default Sidebar;
