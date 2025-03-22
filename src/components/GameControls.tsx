import React from 'react';
import { Box, Button, Typography, Slider } from '@mui/material';
import { GameControls as GameControlsProps, GameMode } from '../types/game';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const GameControls: React.FC<GameControlsProps> = ({
  moves,
  time,
  diskCount,
  onReset,
  onDiskCountChange,
  onUndo,
  onBackToMenu,
  canUndo,
  gameMode,
  playerName,
  difficulty,
  onRequestHint,
  showHintButton
}) => {

  const getDifficultyName = (diff: number): string => {
    switch (diff) {
      case 3: return 'Easy';
      case 4: return 'Medium';
      case 5: return 'Hard';
      case 6: return 'Expert';
      case 7: return 'Master';
      default: return 'Unknown';
    }
  };
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 2,
      }}>
        <Typography>
          <Box component="span" sx={{ color: 'secondary.main', textShadow: '0 0 10px #ff0099', fontWeight: 'bold' }}>
            Player:&nbsp;
          </Box>
          <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 10px #00e5ff', fontWeight: 'bold' }}>
            {playerName}
          </Box>
        </Typography>
        <Typography>
          <Box component="span" sx={{ color: 'secondary.main', textShadow: '0 0 10px #ff0099', fontWeight: 'bold' }}>
            Mode:&nbsp;
          </Box>
          <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 10px #00e5ff', fontWeight: 'bold' }}>
            {gameMode}
          </Box>
        </Typography>
        {(gameMode === GameMode.Normal || gameMode === GameMode.Dynamic) && difficulty && (
          <Typography>
            <Box component="span" sx={{ color: 'secondary.main', textShadow: '0 0 10px #ff0099', fontWeight: 'bold' }}>
              Difficulty:&nbsp;
            </Box>
            <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 10px #00e5ff', fontWeight: 'bold' }}>
              {getDifficultyName(difficulty)}
            </Box>
          </Typography>
        )}
        <Typography>
          <Box component="span" sx={{ color: 'secondary.main', textShadow: '0 0 10px #ff0099', fontWeight: 'bold' }}>
            Moves:&nbsp;
          </Box>
          <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 10px #00e5ff', fontWeight: 'bold' }}>
            {moves}
          </Box>
        </Typography>
        <Typography>
          <Box component="span" sx={{ color: 'secondary.main', textShadow: '0 0 10px #ff0099', fontWeight: 'bold' }}>
            Time:&nbsp;
          </Box>
          <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 10px #00e5ff', fontWeight: 'bold' }}>
            {time}
          </Box>
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
          onClick={onReset}
          variant="contained"
          sx={{
            boxShadow: '0 0 10px #00e5ff',
            '&:hover': {
              boxShadow: '0 0 20px #00e5ff'
            }
          }}
        >
          Reset Game
        </Button>

        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="contained"
          color="secondary"
        >
          Undo Move
        </Button>

        {showHintButton && (
          <Button
            onClick={onRequestHint}
            variant="contained"
            color="warning"
            startIcon={<LightbulbIcon />}
            sx={{
              boxShadow: '0 0 10px #ff0099',
              '&:hover': {
                boxShadow: '0 0 20px #ff0099'
              }
            }}
          >
            AI Hint
          </Button>
        )}
      </Box>

      {gameMode === GameMode.Arcade && (
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>
            <Box component="span" sx={{ color: 'secondary.main', textShadow: '0 0 10px #ff0099', fontWeight: 'bold' }}>
              Number of Disks:&nbsp;
            </Box>
            <Box component="span" sx={{ color: 'primary.main', textShadow: '0 0 10px #00e5ff', fontWeight: 'bold' }}>
              {diskCount}
            </Box>
          </Typography>
          <Slider
            value={diskCount}
            onChange={(_, value) => onDiskCountChange(value as number)}
            min={3}
            max={8}
            marks
            step={1}
          />
        </Box>
      )}
    </Box>
  );
};

export default GameControls;