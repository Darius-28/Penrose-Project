import { useState, useEffect } from 'react';
import { Towers, SelectedDisk, Move } from '../types/game';

interface GameLogic {
  towers: Towers;
  moves: number;
  selectedDisk: SelectedDisk | null;
  setSelectedDisk: (disk: SelectedDisk | null) => void;
  moveDisk: (fromTower: number, toTower: number) => void;
  isValidMove: (fromTower: number, toTower: number) => boolean;
  isGameComplete: boolean;
  undoLastMove: () => void;
  canUndo: boolean;
}

const useGameLogic = (diskCount: number): GameLogic => {
  const [towers, setTowers] = useState<Towers>([[], [], []]);
  const [moves, setMoves] = useState<number>(0);
  const [selectedDisk, setSelectedDisk] = useState<SelectedDisk | null>(null);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  useEffect(() => {
    const initialTower = Array.from(
      { length: diskCount }, 
      (_, i) => diskCount - i
    );
    setTowers([initialTower, [], []]);
    setMoves(0);
    setIsGameComplete(false);
    setMoveHistory([]);
  }, [diskCount]);

  const isValidMove = (fromTower: number, toTower: number): boolean => {
    const fromDisk = towers[fromTower][towers[fromTower].length - 1];
    const toDisk = towers[toTower][towers[toTower].length - 1];
    return !toDisk || fromDisk < toDisk;
  };

  const moveDisk = (fromTower: number, toTower: number): void => {
    if (isValidMove(fromTower, toTower)) {
      const disk = towers[fromTower][towers[fromTower].length - 1];
      
      setTowers(prev => {
        const newTowers = prev.map(tower => [...tower]) as Towers;
        newTowers[fromTower].pop();
        newTowers[toTower].push(disk);
        return newTowers;
      });
      
      setMoveHistory(prev => [...prev, { fromTower, toTower, disk }]);
      setMoves(prev => prev + 1);
      
      // Check win condition after the move
      if (towers[2].length + 1 === diskCount) {
        setIsGameComplete(true);
      }
    }
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
    undoLastMove,
    canUndo: moveHistory.length > 0 && moves > 0
  };
};

export default useGameLogic;