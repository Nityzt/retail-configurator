import { motion, useInView, type Variants } from 'framer-motion';
import { useRef } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const SplitText = ({
  text,
  className = '',
  delay = 0,
  direction = 'left'
}: SplitTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = text.split(' ');

  const getInitialX = () => {
    switch(direction) {
      case 'left': return -100;
      case 'right': return 100;
      default: return 0;
    }
  };

  const getInitialY = () => {
    switch(direction) {
      case 'up': return 100;
      case 'down': return -100;
      default: return 0;
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      x: getInitialX(),
      y: getInitialY(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`flex flex-wrap justify-center gap-x-4 overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const SplitTextChars = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.03
}: SplitTextProps & { stagger?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const chars = text.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ perspective: 1000 }}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};
