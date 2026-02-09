import { useEffect, useRef } from 'react';
import { useCelebration } from './useCelebration';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface CelebrationOverlayProps {
  intensity?: number;
}

export default function CelebrationOverlay({ intensity = 0 }: CelebrationOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isActive, isReducedMotion } = useCelebration(intensity);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Calculate intensity multiplier (1x to 2.5x based on attempts)
    const intensityMultiplier = Math.min(1 + (intensity / 30), 2.5);

    if (prefersReducedMotion || isReducedMotion) {
      // Reduced motion: Show static hearts that fade in with sparkles
      // Scale density with intensity
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const drawStaticHeart = (x: number, y: number, size: number, opacity: number, hue: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = `oklch(0.65 0.22 ${hue})`;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.1, 0, size * 0.8);
        ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);
        ctx.fill();
        ctx.restore();
      };

      const drawStaticSparkle = (x: number, y: number, size: number, opacity: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = `oklch(0.85 0.15 60)`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? size : size / 2;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      // Draw static hearts and sparkles with intensity-based density
      let opacity = 0;
      const targetOpacity = Math.min(0.7 * intensityMultiplier, 0.9);
      const fadeIn = setInterval(() => {
        opacity += 0.05;
        if (opacity > targetOpacity) {
          clearInterval(fadeIn);
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Base pattern
        drawStaticHeart(canvas.width / 2, canvas.height / 2 - 100, 40, opacity, 350);
        drawStaticHeart(canvas.width / 2 - 150, canvas.height / 2, 30, opacity, 340);
        drawStaticHeart(canvas.width / 2 + 150, canvas.height / 2, 30, opacity, 360);
        drawStaticHeart(canvas.width / 2 - 80, canvas.height / 2 + 120, 25, opacity, 345);
        drawStaticHeart(canvas.width / 2 + 80, canvas.height / 2 + 120, 25, opacity, 355);
        
        // Add extra hearts for high intensity
        if (intensityMultiplier > 1.5) {
          drawStaticHeart(canvas.width / 2 - 200, canvas.height / 2 - 80, 28, opacity * 0.8, 335);
          drawStaticHeart(canvas.width / 2 + 200, canvas.height / 2 - 80, 28, opacity * 0.8, 365);
          drawStaticHeart(canvas.width / 2, canvas.height / 2 + 180, 32, opacity * 0.9, 355);
        }
        
        // Sparkles
        drawStaticSparkle(canvas.width / 2 - 100, canvas.height / 2 - 150, 8, opacity * 0.8);
        drawStaticSparkle(canvas.width / 2 + 100, canvas.height / 2 - 150, 8, opacity * 0.8);
        drawStaticSparkle(canvas.width / 2, canvas.height / 2 + 180, 10, opacity * 0.8);
        
        // Extra sparkles for high intensity
        if (intensityMultiplier > 1.3) {
          drawStaticSparkle(canvas.width / 2 - 180, canvas.height / 2, 7, opacity * 0.7);
          drawStaticSparkle(canvas.width / 2 + 180, canvas.height / 2, 7, opacity * 0.7);
        }
      }, 50);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        clearInterval(fadeIn);
      };
    }

    // Enhanced heart particle class with intensity scaling
    class Heart {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      hue: number;
      wobble: number;
      wobbleSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 30 + 15;
        this.speedY = -Math.random() * 4 - 2.5;
        this.speedX = (Math.random() - 0.5) * 3;
        this.opacity = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.hue = Math.random() * 40 + 330;
        this.wobble = 0;
        this.wobbleSpeed = Math.random() * 0.06 + 0.02;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.wobble) * 0.8;
        this.rotation += this.rotationSpeed;
        this.wobble += this.wobbleSpeed;
        
        if (this.y < canvas.height * 0.4) {
          this.opacity -= 0.01;
        }

        return this.opacity > 0 && this.y > -50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        const size = this.size;
        ctx.fillStyle = `oklch(0.65 0.22 ${this.hue})`;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.1, 0, size * 0.8);
        ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);
        ctx.fill();

        ctx.shadowBlur = 15;
        ctx.shadowColor = `oklch(0.65 0.22 ${this.hue})`;

        ctx.restore();
      }
    }

    // Sparkle particle class
    class Sparkle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      life: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 8 + 4;
        this.speedY = -Math.random() * 3 - 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.opacity = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.life = 1;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.life -= 0.015;
        this.opacity = this.life;

        return this.life > 0 && this.y > -50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        ctx.fillStyle = `oklch(0.85 0.15 60)`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? this.size : this.size / 2;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    const hearts: Heart[] = [];
    const sparkles: Sparkle[] = [];
    let animationFrameId: number;

    // Scale particle limits with intensity
    const maxHearts = Math.floor(90 * intensityMultiplier);
    const maxSparkles = Math.floor(40 * intensityMultiplier);
    const heartSpawnRate = Math.min(0.45 * intensityMultiplier, 0.8);
    const sparkleSpawnRate = Math.min(0.3 * intensityMultiplier, 0.6);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new hearts with intensity-scaled frequency
      if (hearts.length < maxHearts && Math.random() < heartSpawnRate) {
        hearts.push(new Heart());
      }

      // Add sparkles with intensity-scaled frequency
      if (sparkles.length < maxSparkles && Math.random() < sparkleSpawnRate) {
        sparkles.push(new Sparkle());
      }

      // Update and draw hearts
      for (let i = hearts.length - 1; i >= 0; i--) {
        const heart = hearts[i];
        if (!heart.update()) {
          hearts.splice(i, 1);
        } else {
          heart.draw(ctx);
        }
      }

      // Update and draw sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sparkle = sparkles[i];
        if (!sparkle.update()) {
          sparkles.splice(i, 1);
        } else {
          sparkle.draw(ctx);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, prefersReducedMotion, isReducedMotion, intensity]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
