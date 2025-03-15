import React from 'react';

interface NotificationProps {
    message: string;
    isVisible: boolean;
  }
  
  export const Notification: React.FC<NotificationProps> = ({ message, isVisible }) => {
    if (!isVisible) return null;
  
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ff4444',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        animation: 'fadeOut 2s forwards'
      }}>
        {message}
      </div>
    );
  };