import { useRef, useState, useEffect, type ReactNode } from 'react';

interface Bounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

interface ResponsiveStageProps {
  children: (containerRef: React.RefObject<HTMLDivElement | null>, bounds: Bounds) => ReactNode;
}

export default function ResponsiveStage({ children }: ResponsiveStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<Bounds>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBounds({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, []);

  return <>{children(containerRef, bounds)}</>;
}
