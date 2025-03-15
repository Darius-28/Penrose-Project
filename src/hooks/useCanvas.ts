import { useRef, useEffect } from 'react';
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

export const useCanvas = ({ towers, selectedDisk, onDiskClick }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawTowers = () => {
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
          const x = (towerIndex + 1) * (canvas.width / 4);
          const y = 380 - (diskIndex * 30);
          const width = diskSize * 30;
          
          const diskColor = diskColors[diskSize - 1] || diskColors[0];
          
          // Draw glow effect
          ctx.shadowBlur = 15;
          ctx.shadowColor = selectedDisk?.tower === towerIndex && 
                           selectedDisk?.disk === diskSize ? '#ffff00' : diskColor;
          
          ctx.fillStyle = selectedDisk?.tower === towerIndex && 
                         selectedDisk?.disk === diskSize ? '#ffff00' : diskColor;
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