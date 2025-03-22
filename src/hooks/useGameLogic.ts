import { useState, useEffect } from 'react';
import { Towers, SelectedDisk, Move } from '../types/game';
import { soundService } from '../services/soundService';

interface GameLogic {
  towers: Towers;
  moves: number;
  selectedDisk: SelectedDisk | null;
  setSelectedDisk: (disk: SelectedDisk | null) => void;
  moveDisk: (fromTower: number, toTower: number) => void;
  isValidMove: (fromTower: number, toTower: number) => boolean;
  isGameComplete: boolean;
  setIsGameComplete: (value: boolean) => void;
  undoLastMove: () => void;
  canUndo: boolean;
}

const useGameLogic = (diskCount: number): GameLogic => {
  const [towers, setTowers] = useState<Towers>([[], [], []]);
  const [moves, setMoves] = useState<number>(0);
  const [selectedDisk, setSelectedDisk] = useState<SelectedDisk | null>(null);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  // Add a reset function
  const resetGame = () => {
    const initialTower = Array.from(
      { length: diskCount }, 
      (_, i) => diskCount - i
    );
    setTowers([initialTower, [], []]);
    setMoves(0);
    setIsGameComplete(false);
    setMoveHistory([]);
    setSelectedDisk(null);
  };

  useEffect(() => {
    if (diskCount > 0) {
      resetGame();
    }
  }, [diskCount]);

  const isValidMove = (fromTower: number, toTower: number): boolean => {
    if (fromTower === toTower || towers[fromTower].length === 0) {
      return false;
    }

    const fromDisk = towers[fromTower][towers[fromTower].length - 1];
    const destinationTower = towers[toTower];

    if (destinationTower.length === 0) {
      return true;
    }

    const topDisk = destinationTower[destinationTower.length - 1];
    return fromDisk < topDisk;
  };

  const checkWinCondition = (currentTowers: Towers): boolean => {
    const lastTower = currentTowers[2];
    if (lastTower.length !== diskCount) return false;

    for (let i = 0; i < lastTower.length - 1; i++) {
      if (lastTower[i] < lastTower[i + 1]) {
        return false;
      }
    }
    return true;
  };

  const moveDisk = (fromTower: number, toTower: number): void => {
    if (!isValidMove(fromTower, toTower)) {
      soundService.playError();
      return;
    }

    const disk = towers[fromTower][towers[fromTower].length - 1];
    soundService.playPlace();
    
    setTowers(prev => {
      const newTowers = prev.map(tower => [...tower]) as Towers;
      newTowers[fromTower].pop();
      newTowers[toTower].push(disk);

      if (checkWinCondition(newTowers)) {
        setTimeout(() => setIsGameComplete(true), 0);
      }

      return newTowers;
    });

    setMoveHistory(prev => [...prev, { fromTower, toTower, disk }]);
    setMoves(prev => prev + 1);
  };

  const undoLastMove = () => {
    if (moveHistory.length === 0 || moves === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    
    setTowers(prev => {
      const newTowers = prev.map(tower => [...tower]) as Towers;
      const disk = newTowers[lastMove.toTower].pop()!;
      newTowers[lastMove.fromTower].push(disk);
      return newTowers;
    });
    
    setMoves(prev => Math.max(0, prev - 1));
    setMoveHistory(prev => prev.slice(0, -1));
    setIsGameComplete(false);
  };

  return {
    towers,
    moves,
    selectedDisk,
    setSelectedDisk,
    moveDisk,
    isValidMove,
    isGameComplete,
    setIsGameComplete,
    undoLastMove,
    canUndo: moveHistory.length > 0 && moves > 0
  };
};

export default useGameLogic;