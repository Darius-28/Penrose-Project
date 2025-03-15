import React from 'react';
import { CanvasProps } from '../types/game';
import { useCanvas } from '../hooks/useCanvas';

const GameCanvas: React.FC<CanvasProps> = (props) => {
  const { canvasRef, handleClick } = useCanvas(props);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      onClick={handleClick}
      style={{ border: '1px solid black' }}
    />
  );
};

export default GameCanvas;