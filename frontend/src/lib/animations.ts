import type { Variants } from 'framer-motion';

// Timing constants
export const DURATION = {
  SUBTLE: 0.2,
  STANDARD: 0.3,
  EMPHASIZED: 0.5,
} as const;

// Easing
export const EASING = {
  SMOOTH: [0.22, 1, 0.36, 1] as const,
} as const;

// Scroll-triggered card reveal
export const scrollReveal: Variants = {
  initial: { opacity: 0, y: 50 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.EMPHASIZED,
      ease: EASING.SMOOTH as any,
    }
  },
};

// Staggered container for form fields
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
};

// Form field reveal
export const formFieldReveal: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.STANDARD,
      ease: EASING.SMOOTH as any,
    }
  },
};

// Card hover effect
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: DURATION.SUBTLE,
      ease: EASING.SMOOTH as any,
    }
  }
};
