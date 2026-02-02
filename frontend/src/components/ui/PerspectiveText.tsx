import type { ReactNode } from 'react';

interface PerspectiveTextProps {
  children: ReactNode;
}

export const PerspectiveText = ({ children }: PerspectiveTextProps) => {
  return (
    <div className="perspective-text-wrapper">
      <p>{children}</p>
      <p>{children}</p>
      <style>{`
        .perspective-text-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .perspective-text-wrapper p {
          margin: 0;
          transition: all 0.75s cubic-bezier(0.76, 0, 0.24, 1);
          pointer-events: none;
          text-transform: uppercase;
        }
        .perspective-text-wrapper p:nth-of-type(2) {
          position: absolute;
          transform-origin: bottom center;
          transform: rotateX(-90deg) translateY(9px);
          opacity: 0;
        }
        .perspective-btn:hover .perspective-text-wrapper {
          transform: rotateX(90deg);
        }
        .perspective-btn:hover .perspective-text-wrapper p:nth-of-type(1) {
          transform: translateY(-100%);
          opacity: 0;
        }
        .perspective-btn:hover .perspective-text-wrapper p:nth-of-type(2) {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};
