export const playSound = (type: 'move' | 'invalid' | 'win') => {
    const sounds = {
      move: new Audio('/sounds/move.mp3'),
      invalid: new Audio('/sounds/invalid.mp3'),
      win: new Audio('/sounds/win.mp3')
    };
  
    sounds[type].play().catch(console.error);
  };