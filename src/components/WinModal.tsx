import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { WinModalProps, GameMode } from '../types/game';

export const WinModal: React.FC<WinModalProps> = ({
  moves,
  time,
  onRestart,
  onBackToMenu,
  isOpen,
  gameMode,
  playerName,
  difficulty,
  optimalMoves,
  moveEfficiency
}) => {
  return (
    <Dialog 
      open={isOpen}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
          boxShadow: '0 0 20px #00e5ff'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center', 
          color: 'primary.main',
          textShadow: '0 0 10px #00e5ff',
          fontWeight: 'bold'
        }}
      >
        Congratulations, {playerName}!
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          mb: 2,
          '& .MuiTypography-root': {
            color: 'primary.main',
            textShadow: '0 0 10px #00e5ff',
            fontWeight: 'bold',
            mb: 1
          }
        }}>
          <Typography variant="h6" gutterBottom>
            Mode: {gameMode}
            {difficulty && ` - Difficulty: ${difficulty}`}
          </Typography>
          <Typography>Time: {time}</Typography>
          <Typography>Moves: {moves}</Typography>
          <Typography>Optimal moves: {optimalMoves}</Typography>
          <Typography>
            Efficiency: {(moveEfficiency * 100).toFixed(1)}%
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 3 }}>
        <Button 
          onClick={onBackToMenu}
          variant="outlined"
          color="secondary"
          sx={{
            boxShadow: '0 0 10px #ff0099',
            '&:hover': {
              boxShadow: '0 0 20px #ff0099'
            }
          }}
        >
          Back to Menu
        </Button>
        <Button 
          onClick={onRestart}
          variant="contained"
          sx={{
            boxShadow: '0 0 10px #00e5ff',
            '&:hover': {
              boxShadow: '0 0 20px #00e5ff'
            }
          }}
        >
          Play Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};