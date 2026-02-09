import { useState, useEffect } from 'react';

export function useCelebration(intensity: number = 0) {
  const [isActive, setIsActive] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReducedMotion);

    // Scale duration with intensity (15s base, up to 25s for high intensity)
    const baseDuration = prefersReducedMotion ? 3000 : 15000;
    const intensityBonus = prefersReducedMotion ? 0 : Math.min(intensity * 200, 10000);
    const duration = baseDuration + intensityBonus;
    
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [intensity]);

  return { isActive, isReducedMotion };
}
