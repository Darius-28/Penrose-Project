import { useState, useEffect } from 'react';
import { Towers, SelectedDisk } from '../types/game';
import { playSound } from '../utils/sounds';

interface GameLogic {
  towers: Towers;
  moves: number;
  selectedDisk: SelectedDisk | null;
  setSelectedDisk: (disk: SelectedDisk | null) => void;
  moveDisk: (fromTower: number, toTower: number) => void;
  isValidMove: (fromTower: number, toTower: number) => boolean;
  isGameComplete: boolean;
}

const useGameLogic = (diskCount: number): GameLogic => {
  const [towers, setTowers] = useState<Towers>([[], [], []]);
  const [moves, setMoves] = useState<number>(0);
  const [selectedDisk, setSelectedDisk] = useState<SelectedDisk | null>(null);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  
  useEffect(() => {
    const initialTower = Array.from(
      { length: diskCount }, 
      (_, i) => diskCount - i
    );
    setTowers([initialTower, [], []]);
    setMoves(0);
    setIsGameComplete(false);
  }, [diskCount]);

  const isValidMove = (fromTower: number, toTower: number): boolean => {
    const fromDisk = towers[fromTower][towers[fromTower].length - 1];
    const toDisk = towers[toTower][towers[toTower].length - 1];
    return !toDisk || fromDisk < toDisk;
  };

  const moveDisk = (fromTower: number, toTower: number): void => {
    if (isValidMove(fromTower, toTower)) {
      setTowers(prev => {
        const newTowers = prev.map(tower => [...tower]) as Towers;
        const disk = newTowers[fromTower].pop()!;
        newTowers[toTower].push(disk);
        return newTowers;
      });
      setMoves(prev => prev + 1);
      
      // Check win condition
      if (towers[2].length === diskCount) {
        setIsGameComplete(true);
       // playSound('win');
      }
    }
   // playSound('move');
  };

  return {
    towers,
    moves,
    selectedDisk,
    setSelectedDisk,
    moveDisk,
    isValidMove,
    isGameComplete
  };
};

export default useGameLogic;