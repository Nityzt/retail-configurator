import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Moderate scroll speed
      touchMultiplier: 1.8, // Good touch response
      infinite: false,
      syncTouch: false, // Let native touch handle the smoothing
      syncTouchLerp: 0.075,
      touchInertiaMultiplier: 20, // Control touch momentum
    });

    let snapTimeout: number;
    let lastScrollTime = Date.now();
    let currentVelocity = 0;

    // Get all sections
    const getSections = () => {
      return Array.from(document.querySelectorAll('section[data-snap]')).map((section) => {
        const rect = section.getBoundingClientRect();
        return {
          element: section as HTMLElement,
          top: rect.top + lenis.scroll,
          height: rect.height,
        };
      });
    };

    // Find nearest section based on current scroll position and velocity
    const getNearestSection = (currentScroll: number, velocity: number) => {
      const sections = getSections();
      if (sections.length === 0) return null;

      const scrollWithMomentum = currentScroll + velocity * 100; // Predict where momentum will take us

      // Find which section is closest to the predicted position
      let nearest = sections[0];
      let minDistance = Math.abs(scrollWithMomentum - sections[0].top);

      sections.forEach((section) => {
        const distance = Math.abs(scrollWithMomentum - section.top);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = section;
        }
      });

      // If we're very close to current section and velocity is low, stay on current
      const currentSectionIndex = sections.findIndex(
        (s) => currentScroll >= s.top - 100 && currentScroll < s.top + s.height - 100
      );

      if (currentSectionIndex !== -1 && Math.abs(velocity) < 0.1) {
        return sections[currentSectionIndex];
      }

      return nearest;
    };

    // Snap to nearest section smoothly
    const snapToSection = () => {
      const currentScroll = lenis.scroll;
      const velocity = currentVelocity;
      const nearestSection = getNearestSection(currentScroll, velocity);

      if (nearestSection) {
        lenis.scrollTo(nearestSection.top, {
          duration: 1.2, // Smooth snap animation
          easing: (t: number) => 1 - Math.pow(1 - t, 3), // Ease out cubic
          lock: true,
          force: true,
        });
      }
    };

    // Listen to scroll events
    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      lastScrollTime = Date.now();
      
      // Track velocity but limit extreme values
      currentVelocity = Math.abs(velocity) > 3 
        ? (velocity > 0 ? 3 : -3)
        : velocity;

      // Clear existing snap timeout
      clearTimeout(snapTimeout);

      // Set timeout to snap when scrolling stops
      snapTimeout = setTimeout(() => {
        const timeSinceLastScroll = Date.now() - lastScrollTime;
        
        // Only snap if user has stopped scrolling for a bit and velocity is low
        if (timeSinceLastScroll > 100 && Math.abs(currentVelocity) < 0.5) {
          snapToSection();
        }
      }, 150) as unknown as number; // Wait 150ms after scroll stops before snapping
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      clearTimeout(snapTimeout);
      lenis.destroy();
    };
  }, []);
};