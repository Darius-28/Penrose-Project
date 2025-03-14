interface WinModalProps {
    moves: number;
    time: number;
    onRestart: () => void;
    isOpen: boolean;
  }
  
  export const WinModal: React.FC<WinModalProps> = ({ moves, time, onRestart, isOpen }) => {
    if (!isOpen) return null;
  
    const modalStyles: React.CSSProperties = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      textAlign: 'center'
    };
  
    return (
      <div style={modalStyles}>
        <h2>Congratulations!</h2>
        <p>You solved the puzzle in {moves} moves</p>
        <p>Time taken: {time} seconds</p>
        <button onClick={onRestart}>Play Again</button>
      </div>
    );
  };