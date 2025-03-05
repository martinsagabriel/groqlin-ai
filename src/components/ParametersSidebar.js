import React from 'react';
import {
    Paper,
    Box,
    Typography,
    IconButton,
    Slider,
    TextField,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

const ParametersSidebar = ({
    isOpen,
    onClose,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
}) => {
    return (
        <Paper
            sx={{
                width: 250,
                height: '100%',
                position: 'fixed',
                right: isOpen ? 0 : -250,
                top: 0,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                bgcolor: 'background.paper',
                borderLeft: '1px solid',
                borderColor: 'divider',
                zIndex: 1100,
                transition: 'right 0.3s ease',
            }}
            elevation={0}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}
            >
                <Typography variant="h6">
                    Parameters
                </Typography>
            </Box>

            {/* Temperature Control */}
            <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                    Temperature
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Slider
                        value={temperature}
                        onChange={(_, value) => setTemperature(value)}
                        min={0}
                        max={2}
                        step={0.1}
                        sx={{ flex: 1 }}
                        color='#b0b0b0'
                    />
                    <TextField
                        value={temperature}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value >= 0 && value <= 2) {
                                setTemperature(value);
                            }
                        }}
                        size="small"
                        type="number"
                        inputProps={{
                            min: 0,
                            max: 2,
                            step: 0.1,
                            style: { width: '60px' }
                        }}
                    />
                </Box>
            </Box>

            {/* Max Tokens Control */}
            <Box sx={{ mb: 4 }}>
                <Typography gutterBottom>
                    Max Completion Tokens
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Slider
                        value={maxTokens}
                        onChange={(_, value) => setMaxTokens(value)}
                        min={1}
                        max={4096}
                        step={1}
                        sx={{ flex: 1 }}
                        color='#b0b0b0'
                    />
                    <TextField
                        value={maxTokens}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1 && value <= 4096) {
                                setMaxTokens(value);
                            }
                        }}
                        size="small"
                        type="number"
                        inputProps={{
                            min: 1,
                            max: 4096,
                            step: 1,
                            style: { width: '60px' }
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default ParametersSidebar; 