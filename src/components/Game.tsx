import React, { useState, useEffect } from "react";
import {
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
import { GameSettings, GameMode, Difficulty, GameResult } from "../types/game";
import { gameService } from "../services/gameService";

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
        setDiskCount(Difficulty.Easy);
      }
    }
  }, [gameSettings]);

  const {
    towers,
    moves,
    selectedDisk,
    isGameComplete,
    setIsGameComplete,
    moveDisk,
    setSelectedDisk,
    undoLastMove,
    canUndo,
  } = useGameLogic(diskCount);

  const handleBackToMenu = () => {
    setGameSettings(null);
    setShowWinModal(false);
    setTime(0);
    setSelectedDisk(null);
    setDiskCount(3);
    setIsGameComplete(false);
  };

  useEffect(() => {
    if (!isGameComplete) {
      const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isGameComplete]);

  useEffect(() => {
    if (isGameComplete && gameSettings) {
      const result: GameResult = {
        difficulty: gameSettings.difficulty || Difficulty.Easy,
        moves,
        time,
        completedAt: new Date(),
        optimalMoves: Math.pow(2, diskCount) - 1,
        moveEfficiency: (Math.pow(2, diskCount) - 1) / moves,
        gameMode: gameSettings.mode,
      };

      setShowWinModal(true);

      if (gameSettings.mode !== GameMode.Arcade) {
        gameService
          .saveGameResult(gameSettings.playerName, result)
          .catch((error) =>
            console.error("Failed to save game result:", error)
          );
      }
    }
  }, [isGameComplete, gameSettings, moves, time, diskCount]);

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
    setIsGameComplete(false);
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
      setIsGameComplete(false);
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
          onBackToMenu={handleBackToMenu}
          canUndo={canUndo}
          gameMode={gameSettings.mode}
          playerName={gameSettings.playerName}
          difficulty={gameSettings.difficulty}
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
          onBackToMenu={handleBackToMenu}
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
