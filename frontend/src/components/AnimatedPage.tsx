import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Variants } from 'framer-motion';

interface AnimatedPageProps {
  children: ReactNode;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export const AnimatedPage = ({ children }: AnimatedPageProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate={prefersReducedMotion ? false : 'animate'}
      exit={prefersReducedMotion ? undefined : 'exit'}
    >
      {children}
    </motion.div>
  );
};
