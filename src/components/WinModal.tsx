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
  isOpen,
  gameMode,
  playerName,
  difficulty,
  optimalMoves,
  moveEfficiency
}) => {
  return (
    <Dialog open={isOpen} onClose={onRestart}>
      <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
        Congratulations, {playerName}!
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
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
      <DialogActions>
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