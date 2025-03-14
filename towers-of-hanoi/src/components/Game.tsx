import React, { useState, useEffect } from 'react';
import GameCanvas from "./GameCanvas";
import GameControls from "./GameControls";
import { WinModal } from "./WinModal";
import useGameLogic from '../hooks/useGameLogic';

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
    setSelectedDisk
  } = useGameLogic(diskCount);

  // Start timer
  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for win condition
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
          disk: towers[towerIndex][towers[towerIndex].length - 1] 
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
    setDiskCount(diskCount);
  };

  const handleDiskCountChange = (count: number) => {
    setDiskCount(count);
    setTime(0);
    setShowWinModal(false);
  };

  const gameStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    gap: '20px'
  };

  return (
    <div style={gameStyles}>
      <GameControls
        moves={moves}
        time={time}
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
        time={time}
        onRestart={handleReset}
        isOpen={showWinModal}
      />
    </div>
  );
};

export default Game;