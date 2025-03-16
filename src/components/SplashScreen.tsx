import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { GameMode, Difficulty, GameSettings } from '../types/game';

interface SplashScreenProps {
  onStart: (settings: GameSettings) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Arcade);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    onStart({
      mode: gameMode,
      playerName: playerName.trim(),
      difficulty: gameMode === GameMode.Normal ? difficulty : undefined
    });
  };

  return (
    <Paper elevation={3} sx={{
      p: 4,
      maxWidth: 500,
      mx: 'auto',
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'primary.main',
      boxShadow: '0 0 20px #00e5ff'
    }}>
      <Typography variant="h4" color="primary" sx={{ mb: 4, textAlign: 'center' }}>
        Towers of Hanoi
      </Typography>

      <TextField
        fullWidth
        label="Your Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        error={!!error}
        helperText={error}
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <RadioGroup
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value as GameMode)}
        >
          <FormControlLabel 
            value={GameMode.Arcade} 
            control={<Radio />} 
            label="Arcade Mode - Practice with any number of disks"
          />
          <FormControlLabel 
            value={GameMode.Normal} 
            control={<Radio />} 
            label="Normal Mode - Compete on the leaderboard"
          />
          <FormControlLabel 
            value={GameMode.Dynamic} 
            control={<Radio />} 
            label="Dynamic Mode - Difficulty adjusts to your skill"
          />
        </RadioGroup>
      </FormControl>

      {gameMode === GameMode.Normal && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            label="Difficulty"
          >
            <MenuItem value={Difficulty.Easy}>Easy (3 disks)</MenuItem>
            <MenuItem value={Difficulty.Medium}>Medium (4 disks)</MenuItem>
            <MenuItem value={Difficulty.Hard}>Hard (5 disks)</MenuItem>
            <MenuItem value={Difficulty.Expert}>Expert (6 disks)</MenuItem>
            <MenuItem value={Difficulty.Master}>Master (7 disks)</MenuItem>
          </Select>
        </FormControl>
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={handleStart}
        sx={{
          boxShadow: '0 0 10px #00e5ff',
          '&:hover': {
            boxShadow: '0 0 20px #00e5ff'
          }
        }}
      >
        Start Game
      </Button>
    </Paper>
  );
};