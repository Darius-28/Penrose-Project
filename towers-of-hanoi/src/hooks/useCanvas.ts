import { useRef, useEffect } from 'react';
import { CanvasProps } from '../types/game';

export const useCanvas = ({ towers, selectedDisk, onDiskClick }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawTowers = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw poles
      towers.forEach((_, index) => {
        const x = (index + 1) * (canvas.width / 4);
        ctx.fillStyle = 'brown';
        ctx.fillRect(x - 10, 100, 20, 300);
      });
      
      // Draw disks
      towers.forEach((tower, towerIndex) => {
        tower.forEach((diskSize, diskIndex) => {
          const x = (towerIndex + 1) * (canvas.width / 4);
          const y = 380 - (diskIndex * 30);
          const width = diskSize * 30;
          
          ctx.fillStyle = selectedDisk?.tower === towerIndex && 
                         selectedDisk?.disk === diskSize ? 'yellow' : 'blue';
          ctx.fillRect(x - width/2, y, width, 20);
        });
      });
    };
    
    drawTowers();
  }, [towers, selectedDisk]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const towerIndex = Math.floor((x / canvas.width) * 3);
    onDiskClick(towerIndex);
  };

  return { canvasRef, handleClick };
};