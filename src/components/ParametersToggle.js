import React from 'react';
import { IconButton, Box } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

const ParametersToggle = ({ isOpen, onClick }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1200,
                backgroundColor: 'background.paper',
                borderRadius: '8px 0 0 8px',
                boxShadow: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <IconButton
                onClick={onClick}
                sx={{
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.3s ease',
                }}
            >
                <ChevronLeft />
            </IconButton>
        </Box>
    );
};

export default ParametersToggle; 