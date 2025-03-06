import React from 'react';
import { Fab } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ScrollToBottomButton = ({ show, onClick }) => {
  if (!show) return null;

  return (
    <Fab
      size="small"
      color="white"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 90,
        right: 20,
        zIndex: 1000,
        opacity: 1,
        '&:hover': {
          opacity: 0.7
        }
      }}
    >
      <ArrowDownwardIcon />
    </Fab>
  );
};

export default ScrollToBottomButton; 