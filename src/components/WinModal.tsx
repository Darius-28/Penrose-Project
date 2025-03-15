import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface WinModalProps {
  moves: number;
  time: number;
  onRestart: () => void;
  isOpen: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({ moves, time, onRestart, isOpen }) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onRestart}
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0 0 20px #00e5ff'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <EmojiEventsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" color="primary">
          Congratulations!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mt: 2 }}>
          You solved the puzzle in {moves} moves
        </Typography>
        <Typography variant="h6">
          Time taken: {time} seconds
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={onRestart}
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