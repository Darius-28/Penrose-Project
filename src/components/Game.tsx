import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import GameCanvas from "./GameCanvas";
import GameControls from "./GameControls";
import { WinModal } from "./WinModal";
import useGameLogic from "../hooks/useGameLogic";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e5ff",
    },
    secondary: {
      main: "#ff0099",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const Game: React.FC = () => {
  const [diskCount, setDiskCount] = useState<number>(3);
  const [time, setTime] = useState<number>(0);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);

  const {
    towers,
    moves,
    selectedDisk,
    isGameComplete,
    moveDisk,
    setSelectedDisk,
  } = useGameLogic(diskCount);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  useEffect(() => {
    if (!isGameComplete) {
      const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isGameComplete]);

  useEffect(() => {
    if (isGameComplete) {
      setShowWinModal(true);
    }
  }, [isGameComplete]);

  const handleDiskClick = (towerIndex: number) => {
    if (selectedDisk === null) {
      if (towers[towerIndex].length > 0) {
        setSelectedDisk({
          tower: towerIndex,
          disk: towers[towerIndex][towers[towerIndex].length - 1],
        });
      }
    } else {
      moveDisk(selectedDisk.tower, towerIndex);
      setSelectedDisk(null);
    }
  };

  const handleReset = () => {
    setShowWinModal(false);
    setTime(0);
    setSelectedDisk(null);
    // Force a re-initialization of the game state
    const currentDiskCount = diskCount;
    setDiskCount(0);
    setTimeout(() => setDiskCount(currentDiskCount), 0);
  };

  const handleDiskCountChange = (count: number) => {
    setDiskCount(count);
    setTime(0);
    setShowWinModal(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "100vh",
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography
          variant="h2"
          color="primary"
          sx={{
            textShadow: "0 0 20px #00e5ff",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Towers of Hanoi
        </Typography>

        <GameControls
          moves={moves}
          time={formatTime(time)}
          diskCount={diskCount}
          onReset={handleReset}
          onDiskCountChange={handleDiskCountChange}
        />
        <GameCanvas
          towers={towers}
          selectedDisk={selectedDisk}
          onDiskClick={handleDiskClick}
        />
        <WinModal
          moves={moves}
          time={formatTime(time)}
          onRestart={handleReset}
          isOpen={showWinModal}
        />
      </Container>
    </ThemeProvider>
  );
};

export default Game;
