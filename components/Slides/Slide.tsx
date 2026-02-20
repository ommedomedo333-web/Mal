import React from 'react';
import '../Slides.css';

interface SlideProps {
  id: number;
  backgroundImage: string;
  children: React.ReactNode;
  active: boolean;
}

const Slide: React.FC<SlideProps> = ({ id, backgroundImage, children, active }) => {
  return (
    <section className={`slide fade-6 kenBurns${active ? ' active' : ''}`}>

      {/* المحتوى يملأ الشاشة بالكامل — بدون wrapper إضافي */}
      <div className="content">
        {children}
      </div>

      {/* الخلفية */}
      <div
        className="background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
    </section>
  );
};

export default Slide;
