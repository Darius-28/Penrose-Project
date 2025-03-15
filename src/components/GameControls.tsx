import React from 'react';
import { GameControls as GameControlsProps } from '../types/game';

const GameControls: React.FC<GameControlsProps> = ({
  moves,
  time,
  diskCount,
  onReset,
  onDiskCountChange
}) => {
  return (
    <div className="controls">
      <div>Moves: {moves}</div>
      <div>Time: {time}s</div>
      <select 
        value={diskCount} 
        onChange={(e) => onDiskCountChange(Number(e.target.value))}
      >
        {[3,4,5,6,7].map(num => (
          <option key={num} value={num}>{num} Disks</option>
        ))}
      </select>
      <button onClick={onReset}>Reset Game</button>
    </div>
  );
};

export default GameControls;