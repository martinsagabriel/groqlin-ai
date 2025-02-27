import React from 'react';
import { IconButton, Box } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

const SidebarToggle = ({ isOpen, onClick }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1200,
        backgroundColor: 'background.paper',
        borderRadius: '0 8px 8px 0',
        boxShadow: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconButton
        onClick={onClick}
        sx={{
          transform: isOpen ? 'none' : 'rotate(180deg)',
          transition: 'transform 0.3s ease',
        }}
      >
        <ChevronLeft />
      </IconButton>
    </Box>
  );
};

export default SidebarToggle; 