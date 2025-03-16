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
import { SplashScreen } from "./SplashScreen";
import useGameLogic from "../hooks/useGameLogic";
import { GameSettings, GameMode, Difficulty } from "../types/game";

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
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [diskCount, setDiskCount] = useState<number>(3);
  const [time, setTime] = useState<number>(0);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);

  useEffect(() => {
    if (gameSettings) {
      if (gameSettings.mode === GameMode.Normal && gameSettings.difficulty) {
        setDiskCount(gameSettings.difficulty);
      } else if (gameSettings.mode === GameMode.Dynamic) {
        setDiskCount(Difficulty.Easy); // Start with Easy for Dynamic mode
      }
    }
  }, [gameSettings]);

  const {
    towers,
    moves,
    selectedDisk,
    isGameComplete,
    moveDisk,
    setSelectedDisk,
    undoLastMove,
    canUndo
  } = useGameLogic(diskCount);

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

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleDiskMove = (fromTower: number, toTower: number) => {
    moveDisk(fromTower, toTower);
    setSelectedDisk(null);
  };

  const handleReset = () => {
    setShowWinModal(false);
    setTime(0);
    setSelectedDisk(null);
    const currentDiskCount = diskCount;
    setDiskCount(0);
    setTimeout(() => setDiskCount(currentDiskCount), 0);
  };

  const handleDiskCountChange = (count: number) => {
    if (gameSettings?.mode === GameMode.Arcade) {
      setDiskCount(count);
      setTime(0);
      setShowWinModal(false);
      setSelectedDisk(null);
    }
  };

  if (!gameSettings) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ minHeight: "100vh", py: 4 }}>
          <SplashScreen onStart={setGameSettings} />
        </Container>
      </ThemeProvider>
    );
  }

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
          onUndo={undoLastMove}
          canUndo={canUndo}
          gameMode={gameSettings.mode}
          playerName={gameSettings.playerName}
        />
        <GameCanvas
          towers={towers}
          selectedDisk={selectedDisk}
          onDiskMove={handleDiskMove}
        />
        <WinModal
          moves={moves}
          time={formatTime(time)}
          onRestart={handleReset}
          isOpen={showWinModal}
          gameMode={gameSettings.mode}
          playerName={gameSettings.playerName}
          difficulty={gameSettings.difficulty}
          optimalMoves={Math.pow(2, diskCount) - 1}
          moveEfficiency={(Math.pow(2, diskCount) - 1) / moves}
        />
      </Container>
    </ThemeProvider>
  );
};

export default Game;