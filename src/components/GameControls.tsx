import React from 'react';
import { Box, Button, Select, MenuItem, Typography, Paper } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UndoIcon from '@mui/icons-material/Undo';
import { GameControls as GameControlsProps } from '../types/game';

const GameControls: React.FC<GameControlsProps> = ({
  moves,
  time,
  diskCount,
  onReset,
  onDiskCountChange,
  onUndo,
  canUndo
}) => {
  return (
    <Paper elevation={3} sx={{ 
      p: 3, 
      display: 'flex', 
      gap: 3,
      alignItems: 'center',
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'primary.main',
      boxShadow: '0 0 10px #00e5ff'
    }}>
      <Typography variant="h6">Moves: {moves}</Typography>
      <Typography variant="h6">Time: {time}</Typography>
      <Select
        value={diskCount}
        onChange={(e) => onDiskCountChange(Number(e.target.value))}
        size="small"
        sx={{ minWidth: 120 }}
      >
        {[3,4,5,6,7].map(num => (
          <MenuItem key={num} value={num}>{num} Disks</MenuItem>
        ))}
      </Select>
      <Button 
        variant="contained" 
        onClick={onUndo}
        disabled={!canUndo}
        startIcon={<UndoIcon />}
        sx={{ 
          boxShadow: '0 0 10px #00e5ff',
          '&:hover': {
            boxShadow: '0 0 20px #00e5ff'
          }
        }}
      >
        Undo
      </Button>
      <Button 
        variant="contained" 
        onClick={onReset}
        startIcon={<RestartAltIcon />}
        sx={{ 
          boxShadow: '0 0 10px #00e5ff',
          '&:hover': {
            boxShadow: '0 0 20px #00e5ff'
          }
        }}
      >
        Reset Game
      </Button>
    </Paper>
  );
};

export default GameControls;