import { useRef, useEffect, useState } from 'react';
import { CanvasProps } from '../types/game';

const diskColors = [
  '#00e5ff', // cyan
  '#ff0099', // pink
  '#39ff14', // neon green
  '#ff3131', // neon red
  '#ff8400', // neon orange
  '#9d00ff', // neon purple
  '#ffff00'  // yellow
];

interface DragState {
  isDragging: boolean;
  draggedDisk: number;
  sourceTower: number;
  dragX: number;
  dragY: number;
}

export const useCanvas = ({ towers, selectedDisk, onDiskMove }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const drawTowers = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw poles with neon effect
    towers.forEach((_, index) => {
      const x = (index + 1) * (canvas.width / 4);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff0099';
      ctx.fillStyle = '#ff0099';
      ctx.fillRect(x - 10, 100, 20, 300);
    });
    
    // Reset shadow for disks
    ctx.shadowBlur = 0;
    
    // Draw disks with neon effect
    towers.forEach((tower, towerIndex) => {
      tower.forEach((diskSize, diskIndex) => {
        // Skip drawing the disk being dragged
        if (dragState?.isDragging && 
            towerIndex === dragState.sourceTower && 
            diskSize === dragState.draggedDisk && 
            diskIndex === tower.length - 1) {
          return;
        }

        const x = (towerIndex + 1) * (canvas.width / 4);
        const y = 380 - (diskIndex * 30);
        const width = diskSize * 30;
        
        const diskColor = diskColors[diskSize - 1] || diskColors[0];
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = diskColor;
        ctx.fillStyle = diskColor;
        ctx.fillRect(x - width/2, y, width, 20);
      });
    });

    // Draw dragged disk
    if (dragState?.isDragging) {
      const width = dragState.draggedDisk * 30;
      const diskColor = diskColors[dragState.draggedDisk - 1] || diskColors[0];
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ffff00';
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(dragState.dragX - width/2, dragState.dragY - 10, width, 20);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawTowers(ctx, canvas);
  }, [towers, dragState]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const towerIndex = Math.floor((x / canvas.width) * 3);
    
    const tower = towers[towerIndex];
    if (tower.length === 0) return;

    const topDisk = tower[tower.length - 1];
    setDragState({
      isDragging: true,
      draggedDisk: topDisk,
      sourceTower: towerIndex,
      dragX: x,
      dragY: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState?.isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setDragState(prev => ({
      ...prev!,
      dragX: e.clientX - rect.left,
      dragY: e.clientY - rect.top
    }));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState?.isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const targetTower = Math.floor((x / canvas.width) * 3);

    if (targetTower !== dragState.sourceTower) {
      onDiskMove(dragState.sourceTower, targetTower);
    }

    setDragState(null);
  };

  return {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};