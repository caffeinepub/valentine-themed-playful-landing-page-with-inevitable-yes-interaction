import { useState, useEffect } from 'react';

export function useCelebration() {
  const [isActive, setIsActive] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReducedMotion);

    // Enhanced celebration duration - longer for full experience
    const duration = prefersReducedMotion ? 3000 : 15000; // 3s for reduced motion, 15s for full
    
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return { isActive, isReducedMotion };
}
