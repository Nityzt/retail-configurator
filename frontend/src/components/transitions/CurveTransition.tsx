import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CurveTransitionProps {
  isVisible: boolean;
  backgroundColor?: string;
  text?: string;
  textColor?: string;
  onComplete?: () => void;
}

const anim = (variants: any) => ({
  variants,
  initial: 'initial',
  animate: 'enter',
  exit: 'exit',
});

const textVariants = {
  initial: { opacity: 1, top: '40%' },
  enter: {
    opacity: 0,
    top: -100,
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
    transitionEnd: { top: '47.5%' },
  },
  exit: {
    opacity: 1,
    top: '40%',
    transition: { duration: 0.5, delay: 0.4, ease: [0.33, 1, 0.68, 1] },
  },
};

const translateVariants = {
  initial: { top: '-300px' },
  enter: {
    top: '-100vh',
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
    transitionEnd: { top: '100vh' },
  },
  exit: {
    top: '-300px',
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
};

const curveVariants = (initialPath: string, targetPath: string) => ({
  initial: { d: initialPath },
  enter: {
    d: targetPath,
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    d: initialPath,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
});

const SVGCurve = ({ height, width, backgroundColor }: { height: number; width: number; backgroundColor: string }) => {
  const initialPath = `M0 300 Q${width / 2} 0 ${width} 300 L${width} ${height + 300} Q${width / 2} ${height + 600} 0 ${height + 300} L0 0`;
  const targetPath = `M0 300 Q${width / 2} 0 ${width} 300 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`;

  return (
    <motion.svg {...anim(translateVariants)} style={{ position: 'fixed', height: 'calc(100vh + 600px)', width: '100vw', pointerEvents: 'none', left: 0, top: 0, zIndex: 99 }}>
      <motion.path {...anim(curveVariants(initialPath, targetPath))} fill={backgroundColor} />
    </motion.svg>
  );
};

export const CurveTransition = ({ isVisible, backgroundColor = '#000', text = '', textColor = '#fff', onComplete }: CurveTransitionProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isVisible && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none' }}>
          <div style={{ position: 'fixed', height: 'calc(100vh + 600px)', width: '100vw', pointerEvents: 'none', left: 0, top: 0, backgroundColor, opacity: dimensions.width === 0 ? 1 : 0, transition: 'opacity 0s linear 0.1s' }} />
          {text && (
            <motion.p {...anim(textVariants)} style={{ position: 'absolute', left: '50%', top: '40%', color: textColor, fontSize: '46px', fontWeight: 'bold', zIndex: 101, transform: 'translateX(-50%)', textAlign: 'center' }}>
              {text}
            </motion.p>
          )}
          {dimensions.width > 0 && <SVGCurve width={dimensions.width} height={dimensions.height} backgroundColor={backgroundColor} />}
        </div>
      )}
    </AnimatePresence>
  );
};
