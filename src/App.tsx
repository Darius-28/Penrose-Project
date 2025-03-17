import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import Game from './components/Game';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      backgroundImage: 'url("images/background.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.8)',
        zIndex: 1,
        minHeight: '200vh'
      }
    }}>
      <CssBaseline />
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Game />
      </Box>
    </Box>
  );
}

export default App;