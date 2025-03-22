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
          color: '#ff0099',
          textShadow: '0 0 10px #ff0099',
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
          },
          '& .label': {
            color: '#ff0099',
            textShadow: '0 0 10px #ff0099',
            display: 'inline'
          },
          '& .value': {
            color: '#00e5ff',
            textShadow: '0 0 10px #00e5ff',
            display: 'inline',
            ml: 1
          }
        }}>
          <Typography variant="h6" gutterBottom>
      <span className="label">Mode:</span>
      <span className="value">{gameMode}</span>
      {difficulty && (
        <>
          <span className="label"> - Difficulty: </span>
          <span className="value">{difficulty}</span>
        </>
      )}
    </Typography>
    <Typography>
      <span className="label">Time: </span>
      <span className="value">{time}</span>
    </Typography>
    <Typography>
      <span className="label">Moves: </span>
      <span className="value">{moves}</span>
    </Typography>
    <Typography>
      <span className="label">Optimal moves: </span>
      <span className="value">{optimalMoves}</span>
    </Typography>
          <Typography>
           <span className='label'> Efficiency: </span>
           <span className='value'> {(moveEfficiency * 100).toFixed(1)}%</span>
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