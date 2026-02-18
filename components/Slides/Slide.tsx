import React from 'react';
import '../Slides.css';

interface SlideProps {
  id: number;
  backgroundImage: string;
  children: React.ReactNode;
  active: boolean;
}

const Slide: React.FC<SlideProps> = ({ id, backgroundImage, children, active }) => {
  const activeClass = active ? 'active' : '';

  return (
    <section className={`slide fade-6 kenBurns ${activeClass}`}>
      <div className="content">
        <div className="container">
          <div className="wrap">
            {children}
          </div>
        </div>
      </div>
      <div 
        className="background" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
    </section>
  );
};

export default Slide;
