import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import Game from './components/Game';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      backgroundImage: 'url("images/background.png")', // assuming your image is named background.jpg
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.8)', // dark overlay
        zIndex: 1
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