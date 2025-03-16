import { useState, useRef } from 'react';
import { SelectedDisk } from '../types/game';

interface DragState {
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
}

export const useDragAndDrop = (
  towers: number[][],
  setSelectedDisk: (disk: SelectedDisk | null) => void,
  moveDisk: (fromTower: number, toTower: number) => void
) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
  });
  
  const draggedDisk = useRef<SelectedDisk | null>(null);

  const handleDragStart = (e: React.MouseEvent<HTMLCanvasElement>, towerIndex: number) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tower = towers[towerIndex];
    if (tower.length === 0) return;

    const disk = tower[tower.length - 1];
    draggedDisk.current = { tower: towerIndex, disk };
    setSelectedDisk({ tower: towerIndex, disk });

    setDragState({
      isDragging: true,
      dragStartX: x,
      dragStartY: y,
    });
  };

  const handleDragMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Update disk position for visual feedback
    // This will be handled in the useCanvas hook
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging || !draggedDisk.current) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const targetTower = Math.floor((x / canvas.width) * 3);

    if (targetTower !== draggedDisk.current.tower) {
      moveDisk(draggedDisk.current.tower, targetTower);
    }

    setDragState({
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    });
    setSelectedDisk(null);
    draggedDisk.current = null;
  };

  return {
    dragState,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};