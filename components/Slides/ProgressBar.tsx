import React from 'react';
import '../ProgressBar.css';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div 
      className="progress-bar blue" 
      style={{ width: `${progress}%` }}
    />
  );
};

export default ProgressBar;