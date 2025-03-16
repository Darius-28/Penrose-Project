import React from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { CanvasProps } from '../types/game';

const GameCanvas: React.FC<CanvasProps> = (props) => {
  const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp } = useCanvas(props);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        border: '1px solid',
        borderColor: '#00e5ff',
        borderRadius: '8px',
        boxShadow: '0 0 20px #00e5ff',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    />
  );
};

export default GameCanvas;