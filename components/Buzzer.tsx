import React from 'react';

const Buzzer: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <g fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="square">
          <path d="M 43.02 56.99 A 9.88 9.88 90 1 1 50.01 59.88 M 55.68 36.32 A 14.81 14.81 90 0 1 64.82 50.01 M 63.7 55.68 A 14.81 14.81 90 0 1 39.53 60.48 M 36.32 55.68 A 14.81 14.81 90 0 1 35.19 50.01 M 36.32 44.34 A 14.81 14.81 90 0 1 44.34 36.32 M 42.45 31.76 A 19.75 19.75 90 0 1 68.26 42.45 M 69.76 50.01 A 19.75 19.75 90 0 1 68.26 57.57 M 63.98 63.98 A 19.75 19.75 90 0 1 57.57 68.26 M 50.01 69.76 A 19.75 19.75 90 0 1 31.76 57.57 M 30.26 50.01 A 19.75 19.75 90 0 1 31.76 42.45 M 32.55 32.55 A 24.69 24.69 90 0 1 50.01 25.32 M 54.83 25.79 A 24.69 24.69 90 0 1 63.73 29.48 M 67.47 32.55 A 24.69 24.69 90 0 1 74.23 54.83 M 72.82 59.46 A 24.69 24.69 90 0 1 70.54 63.73 M 67.47 67.47 A 24.69 24.69 90 0 1 63.73 70.54 M 59.46 72.82 A 24.69 24.69 90 0 1 45.19 74.23 M 36.29 70.54 A 24.69 24.69 90 0 1 32.55 67.47 M 29.48 63.73 A 24.69 24.69 90 0 1 25.79 45.19 M 27.2 40.56 A 24.69 24.69 90 0 1 29.48 36.29 M 66.47 25.37 A 29.63 29.63 90 0 1 70.96 29.06 M 77.38 38.67 A 29.63 29.63 90 0 1 61.35 77.38 M 38.67 77.38 A 29.63 29.63 90 0 1 33.55 74.64 M 29.06 70.96 A 29.63 29.63 90 0 1 25.37 66.47 M 22.63 61.35 A 29.63 29.63 90 0 1 20.38 50.01 M 20.95 44.23 A 29.63 29.63 90 0 1 22.63 38.67 M 25.37 33.55 A 29.63 29.63 90 0 1 33.55 25.37 M 43.27 16.11 A 34.57 34.57 90 0 1 69.21 21.27 M 78.75 30.8 A 34.57 34.57 90 0 1 83.91 43.27 M 81.94 63.24 A 34.57 34.57 90 0 1 36.78 81.94 M 30.8 78.75 A 34.57 34.57 90 0 1 25.57 74.45 M 21.27 69.21 A 34.57 34.57 90 0 1 18.07 63.24 M 15.44 50.01 A 34.57 34.57 90 0 1 21.27 30.8 M 25.57 25.57 A 34.57 34.57 90 0 1 30.8 21.27 M 28.06 17.16 A 39.51 39.51 90 0 1 50.01 10.5 M 65.13 13.51 A 39.51 39.51 90 0 1 89.52 50.01 M 86.51 65.13 A 39.51 39.51 90 0 1 82.86 71.96 M 77.94 77.94 A 39.51 39.51 90 0 1 71.96 82.86 M 65.13 86.51 A 39.51 39.51 90 0 1 17.16 71.96 M 13.51 65.13 A 39.51 39.51 90 0 1 11.26 57.72 M 11.26 42.3 A 39.51 39.51 90 0 1 13.51 34.89 M 17.16 28.06 A 39.51 39.51 90 0 1 22.07 22.07 M 58.68 6.42 A 44.44 44.44 90 0 1 78.2 15.65 M 86.96 25.32 A 44.44 44.44 90 0 1 89.2 29.06 M 92.54 37.11 A 44.44 44.44 90 0 1 94.24 45.65 M 94.45 50.01 A 44.44 44.44 90 0 1 93.6 58.68 M 92.54 62.91 A 44.44 44.44 90 0 1 91.07 67.02 M 86.96 74.7 A 44.44 44.44 90 0 1 78.2 84.36 M 74.7 86.96 A 44.44 44.44 90 0 1 54.37 94.24 M 50.01 94.45 A 44.44 44.44 90 0 1 41.34 93.6 M 33 91.07 A 44.44 44.44 90 0 1 29.06 89.2 M 21.81 84.36 A 44.44 44.44 90 0 1 18.58 81.44 M 15.65 78.2 A 44.44 44.44 90 0 1 7.48 62.91 M 6.42 58.68 A 44.44 44.44 90 0 1 5.78 45.65 M 6.42 41.34 A 44.44 44.44 90 0 1 7.48 37.11 M 8.95 33 A 44.44 44.44 90 0 1 18.58 18.58 M 21.81 15.65 A 44.44 44.44 90 0 1 25.32 13.05 M 37.11 7.48 A 44.44 44.44 90 0 1 45.65 5.78 M 54.85 0.86 A 49.38 49.38 90 1 1 50.01 0.63 M 50.01 5.56 L 50.01 10.5 M 50.01 15.44 L 50.01 25.32 M 50.01 35.19 L 50.01 40.13 M 54.85 0.86 L 54.37 5.78 M 58.68 6.42 L 56.75 16.11 M 55.79 20.95 L 54.83 25.79 M 63.24 18.07 L 61.35 22.63 M 59.46 27.2 L 57.57 31.76 M 66.47 25.37 L 63.73 29.48 M 81.34 11.84 L 78.2 15.65 M 81.44 18.58 L 70.96 29.06 M 88.18 18.68 L 84.36 21.81 M 86.96 25.32 L 82.86 28.06 M 78.75 30.8 L 70.54 36.29 M 95.63 31.11 L 91.07 33 M 99.15 45.17 L 94.24 45.65 M 94.45 50.01 L 89.52 50.01 M 84.58 50.01 L 79.64 50.01 M 74.7 50.01 L 59.88 50.01 M 93.6 58.68 L 79.07 55.79 M 97.27 64.34 L 92.54 62.91 M 91.07 67.02 L 81.94 63.24 M 72.82 59.46 L 68.26 57.57 M 93.56 73.29 L 89.2 70.96 M 86.96 74.7 L 82.86 71.96 M 74.64 66.47 L 70.54 63.73 M 67.47 67.47 L 60.48 60.48 M 74.7 86.96 L 71.96 82.86 M 58.68 93.6 L 57.72 88.76 M 56.75 83.91 L 54.83 74.23 M 50.01 84.58 L 50.01 79.64 M 50.01 74.7 L 50.01 64.82 M 41.34 93.6 L 42.3 88.76 M 44.23 79.07 L 45.19 74.23 M 35.67 97.27 L 37.11 92.54 M 33 91.07 L 34.89 86.51 M 36.78 81.94 L 40.56 72.82 M 22.57 91.07 L 25.32 86.96 M 30.8 78.75 L 33.55 74.64 M 15.09 84.93 L 18.58 81.44 M 29.06 70.96 L 36.04 63.98 M 39.53 60.48 L 43.02 56.99 M 13.05 74.7 L 17.16 71.96 M 21.27 69.21 L 25.37 66.47 M 8.95 67.02 L 22.63 61.35 M 27.2 59.46 L 36.32 55.68 M 11.26 57.72 L 16.11 56.75 M 5.56 50.01 L 15.44 50.01 M 0.86 45.17 L 5.78 45.65 M 6.42 41.34 L 11.26 42.3 M 8.95 33 L 13.51 34.89 M 22.63 38.67 L 36.32 44.34 M 17.16 28.06 L 29.48 36.29 M 18.58 18.58 L 22.07 22.07 M 32.55 32.55 L 36.04 36.04 M 25.32 13.05 L 30.8 21.27 M 26.73 6.46 L 29.06 10.81 M 33 8.95 L 40.56 27.2 M 35.67 2.75 L 37.11 7.48 M 43.27 16.11 L 44.23 20.95" transform="rotate(87.5 50 50)" />
        </g>
        <circle cx="99" cy="50" r="1" fill="deeppink">
          <animate id="c1" attributeName="cx" values="99; 97" dur=".2s" begin="0s; cResetX.end" repeatCount="0" fill="freeze" />
          <animate id="c2" attributeName="cx" values="97; 92" dur=".2s" begin="m1.end" repeatCount="0" fill="freeze" />
          <animate id="c3" attributeName="cx" values="92; 97" dur=".2s" begin="m2.end" repeatCount="0" fill="freeze" />
          <animate id="c4" attributeName="cx" values="97; 92" dur=".2s" begin="m3.end" repeatCount="0" fill="freeze" />
          <animate id="c5" attributeName="cx" values="92; 97" dur=".2s" begin="m4.end" repeatCount="0" fill="freeze" />
          <animate id="c6" attributeName="cx" values="97; 87" dur=".2s" begin="m5.end" repeatCount="0" fill="freeze" />
          <animate id="c7" attributeName="cx" values="87; 82" dur=".2s" begin="m6.end" repeatCount="0" fill="freeze" />
          <animate id="c8" attributeName="cx" values="82; 77" dur=".2s" begin="m7.end" repeatCount="0" fill="freeze" />
          <animate id="c9" attributeName="cx" values="77; 67" dur=".2s" begin="m8.end" repeatCount="0" fill="freeze" />
          <animate id="c10" attributeName="cx" values="67; 72" dur=".2s" begin="m9.end" repeatCount="0" fill="freeze" />
          <animate id="c11" attributeName="cx" values="72; 82" dur=".2s" begin="m10.end" repeatCount="0" fill="freeze" />
          <animate id="c12" attributeName="cx" values="82; 77" dur=".2s" begin="m11.end" repeatCount="0" fill="freeze" />
          <animate id="c13" attributeName="cx" values="77; 82" dur=".2s" begin="m12.end" repeatCount="0" fill="freeze" />
          <animate id="c14" attributeName="cx" values="82; 87" dur=".2s" begin="m13.end" repeatCount="0" fill="freeze" />
          <animate id="c15" attributeName="cx" values="87; 92" dur=".2s" begin="m14.end" repeatCount="0" fill="freeze" />
          <animate id="c16" attributeName="cx" values="92; 97.5" dur=".2s" begin="m15.end" repeatCount="0" fill="freeze" />
          <animate id="c17" attributeName="cx" values="97.5; 92" dur=".2s" begin="m16.end" repeatCount="0" fill="freeze" />
          <animate id="c18" attributeName="cx" values="92; 97.5" dur=".2s" begin="m17.end" repeatCount="0" fill="freeze" />
          <animate id="c19" attributeName="cx" values="97.5; 92" dur=".2s" begin="m18.end" repeatCount="0" fill="freeze" />
          <animate id="c20" attributeName="cx" values="92; 97.5" dur=".2s" begin="m19.end" repeatCount="0" fill="freeze" />
          <animate id="c21" attributeName="cx" values="97.5; 82" dur=".2s" begin="m20.end" repeatCount="0" fill="freeze" />
          <animate id="c22" attributeName="cx" values="82; 77" dur=".2s" begin="m21.end" repeatCount="0" fill="freeze" />
          <animate id="c23" attributeName="cx" values="77; 67" dur=".2s" begin="m22.end" repeatCount="0" fill="freeze" />
          <animate id="c24" attributeName="cx" values="67; 62.5" dur=".2s" begin="m23.end" repeatCount="0" fill="freeze" />
          <animate id="c25" attributeName="cx" values="62.5; 50" dur=".2s" begin="m24.end" repeatCount="0" fill="freeze" />
          <animate id="cGrow" attributeName="r" values="1; 9" dur=".8s" begin="c25.end" repeatCount="0" fill="freeze" />
          <animate id="cOpacity" attributeName="opacity" values="1; 0" dur=".8s" begin="cGrow.end" repeatCount="0" fill="freeze" />
          <animate id="cResetR" attributeName="r" values="10; 1" dur=".1s" begin="cOpacity.end" repeatCount="0" fill="freeze" />
          <animate id="cResetX" attributeName="cx" values="50; 98" dur=".1s" begin="cOpacity.end" repeatCount="0" fill="freeze" />
          <animate id="cResetOpacity" attributeName="opacity" values="0; 1" dur=".1s" begin="cResetX.end" repeatCount="0" fill="freeze" />
        </circle>
      </svg>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', color: '#fff', fontWeight: 900, fontSize: 'clamp(28px,6vw,64px)', fontFamily: 'Cairo, sans-serif' }}>elatyab</div>
    </div>
  );
};

export default Buzzer;
