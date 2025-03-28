import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  createTheme,
  ThemeProvider,
  Box,
  IconButton,
} from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GameCanvas from "./GameCanvas";
import GameControls from "./GameControls";
import { WinModal } from "./WinModal";
import { SplashScreen } from "./SplashScreen";
import { Leaderboard } from "./Leaderboard";
import useGameLogic from "../hooks/useGameLogic";
import {
  GameSettings,
  GameMode,
  Difficulty,
  GameResult,
  LeaderboardEntry,
  Move,
} from "../types/game";
import { gameService } from "../services/gameService";
import { aiService } from "../services/aiService";
import { soundService } from "../services/soundService";
import { MusicNote, MusicOff, VolumeUp, VolumeOff } from "@mui/icons-material";

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
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [hint, setHint] = useState<Move | null>(null);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (gameSettings) {
      // Reset all game state
      setTime(0);
      setShowWinModal(false);
      setSelectedDisk(null);
      setIsGameComplete(false);
      setShowLeaderboard(false);
      setDiskCount(0);

      // Sets new disk counts for dynamic mode
      const timer = setTimeout(async () => {
        if (gameSettings.mode === GameMode.Dynamic) {
          try {
            const player = await gameService.getOrCreatePlayer(
              gameSettings.playerName
            );
            const stats = await gameService.getPlayerStats(
              gameSettings.playerName
            );
            setDiskCount(stats?.currentDifficulty || Difficulty.Easy);
          } catch (error) {
            console.error("Error fetching player stats:", error);
            setDiskCount(Difficulty.Easy);
          }
        } else if (
          gameSettings.mode === GameMode.Normal &&
          gameSettings.difficulty
        ) {
          setDiskCount(Number(gameSettings.difficulty));
        } else {
          setDiskCount(3);
        }
      }, 100);

      return () => clearTimeout(timer);
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
    setTowers,
    setMoves,
  } = useGameLogic(diskCount);

  const handleBackToMenu = () => {
    setGameSettings(null);
    setShowWinModal(false);
    setTime(0);
    setSelectedDisk(null);
    setDiskCount(3);
    setIsGameComplete(false);
    setShowLeaderboard(false);
  };

  // Effect for updating the time every second
  useEffect(() => {
    if (!isGameComplete) {
      const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isGameComplete]);

  // Effect for fetching leaderboard data
  useEffect(() => {
    if (gameSettings?.mode === GameMode.Normal && gameSettings.difficulty) {
      gameService
        .getLeaderboard(gameSettings.difficulty)
        .then(setLeaderboardData)
        .catch(console.error);
    }
  }, [gameSettings?.mode, gameSettings?.difficulty]);

  // Effect for saving game result and showing win modal
  useEffect(() => {
    if (isGameComplete && gameSettings) {
      soundService.playVictory();
      const result: GameResult = {
        difficulty: gameSettings.difficulty || (diskCount as Difficulty),
        moves,
        time,
        completedAt: new Date(),
        optimalMoves: Math.pow(2, diskCount) - 1,
        moveEfficiency: (Math.pow(2, diskCount) - 1) / moves,
        gameMode: gameSettings.mode,
      };

      setShowWinModal(true);

      if (gameSettings.mode === GameMode.Normal) {
        gameService
          .saveGameResult(gameSettings.playerName, result)
          .then(() => gameService.getLeaderboard(gameSettings.difficulty!))
          .then(setLeaderboardData)
          .catch(console.error);
      } else if (gameSettings.mode === GameMode.Dynamic) {
        gameService
          .getOrCreatePlayer(gameSettings.playerName)
          .then((player) => gameService.updatePlayerStats(player.id, result))
          .catch(console.error);
      }
    }
  }, [isGameComplete, gameSettings, moves, time, diskCount]);

  useEffect(() => {
    if (hasInteracted && isMusicOn) {
      soundService.startBackgroundMusic();
    }
    return () => soundService.stopBackgroundMusic();
  }, [hasInteracted, isMusicOn]);

  // Add interaction handler
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
    soundService.toggleMusic();
    setHasInteracted(true);
  };

const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
    soundService.toggleSound();
};

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleDiskMove = (fromTower: number, toTower: number) => {
    if (fromTower !== toTower) {
      moveDisk(fromTower, toTower);
      setSelectedDisk(null);
    }
  };

  const handleReset = async () => {
    // Reset all game states
    setShowWinModal(false);
    setTime(0);
    setSelectedDisk(null);
    setIsGameComplete(false);
    setMoves(0);
    setHint(null);
  
    // Handle dynamic mode reset
    if (gameSettings?.mode === GameMode.Dynamic) {
      try {
        const player = await gameService.getOrCreatePlayer(gameSettings.playerName);
  
        if (isGameComplete) {
          await gameService.updatePlayerStats(player.id, {
            difficulty: diskCount as Difficulty,
            moves,
            time,
            completedAt: new Date(),
            optimalMoves: Math.pow(2, diskCount) - 1,
            moveEfficiency: (Math.pow(2, diskCount) - 1) / moves,
            gameMode: GameMode.Dynamic,
          });
  
          const updatedStats = await gameService.getPlayerStats(gameSettings.playerName);
          if (updatedStats) {
            // Reset disk count with updated difficulty
            setDiskCount(0);
            setTimeout(() => setDiskCount(updatedStats.currentDifficulty), 0);
  
            // Reset towers after difficulty update
            const newDiskCount = updatedStats.currentDifficulty;
            const initialTower = Array.from(
              { length: newDiskCount }, 
              (_, i) => newDiskCount - i
            );
            setTowers([initialTower, [], []]);
            return;
          }
        }
  
        // If not complete, reset with current difficulty
        const playerStats = await gameService.getPlayerStats(gameSettings.playerName);
        if (playerStats) {
          setDiskCount(playerStats.currentDifficulty);
        }
      } catch (error) {
        console.error("Error updating dynamic difficulty:", error);
      }
    }
  
    // Reset for non-dynamic modes
    const currentDiskCount = diskCount;
    setDiskCount(0);
    setTimeout(() => {
      setDiskCount(currentDiskCount);
      const initialTower = Array.from(
        { length: currentDiskCount }, 
        (_, i) => currentDiskCount - i
      );
      setTowers([initialTower, [], []]);
    }, 0);
  };

  const handleDiskCountChange = (count: number) => {
    if (gameSettings?.mode === GameMode.Arcade) {
      // Force a complete reset with the new disk count
      setDiskCount(0);
      setTime(0);
      setShowWinModal(false);
      setSelectedDisk(null);
      setIsGameComplete(false);

      // Use requestAnimationFrame to ensure state updates are processed
      requestAnimationFrame(() => {
        setDiskCount(count);
      });
    }
  };

  const handleRequestHint = async () => {
    if (gameSettings?.mode === GameMode.Arcade) {
      const suggestedMove = await aiService.getNextMove(towers);
      setHint(suggestedMove);

      // Clear hint after 3 seconds
      setTimeout(() => setHint(null), 3000);
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
         <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          gap: 1
        }}>
          <IconButton 
            onClick={toggleMusic}
            sx={{ 
              color: '#00e5ff',
              '&:hover': { color: '#ff0099' }
            }}
          >
            {isMusicOn ? <MusicNote /> : <MusicOff />}
          </IconButton>
          <IconButton 
            onClick={toggleSound}
            sx={{ 
              color: '#00e5ff',
              '&:hover': { color: '#ff0099' }
            }}
          >
            {isSoundOn ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
        </Box>
        
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
          onRequestHint={handleRequestHint}
          showHintButton={gameSettings?.mode === GameMode.Arcade}
        />

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <GameCanvas
            towers={towers}
            selectedDisk={selectedDisk}
            onDiskMove={handleDiskMove}
            hint={hint}
            gameMode={gameSettings?.mode || GameMode.Arcade}
          />

          {gameSettings.mode === GameMode.Normal && (
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                sx={{
                  position: "absolute",
                  top: -50,
                  right: 0,
                  color: "primary.main",
                  boxShadow: "0 0 10px #00e5ff",
                  "&:hover": {
                    color: "secondary.main",
                    boxShadow: "0 0 20px #ff0099",
                  },
                }}
              >
                <LeaderboardIcon />
              </IconButton>

              {showLeaderboard && gameSettings.difficulty && (
                <Leaderboard
                  entries={leaderboardData}
                  difficulty={gameSettings.difficulty}
                />
              )}
            </Box>
          )}
        </Box>

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
