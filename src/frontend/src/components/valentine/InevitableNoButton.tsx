import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useSafeRandomPosition } from './useSafeRandomPosition';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { getBehavior } from './noButtonBehaviors';

interface InevitableNoButtonProps {
  onAttempt: () => void;
  attempts: number;
  bounds: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

const NO_BUTTON_LABELS = [
  'No',
  'Are you sure? 🤔',
  'Really? 😮',
  'Think again! 💭',
  'Maybe yes? 🥺',
  'Last chance! ⚠️',
  'Please? 🥺',
  'Come on... 😊',
  'You sure? 🤨',
  'Positive? 🧐',
  'Reconsider? 💡',
  'Pretty please? 🙏',
  'One more time? 🔄',
  'Final answer? 📝',
  'You mean yes? 😏',
];

// Cycling labels for attempts beyond the initial set
const EXTRA_NO_LABELS = [
  'Still no? 😅',
  'Seriously? 🙃',
  'Not giving up? 💪',
  'Try again! 🎯',
  'Nope! 🚫',
  'Keep trying! 😄',
  'Almost! 🎪',
  'So close! 🎲',
  'Nice try! 🎭',
  'Oops! 🎨',
];

function getNoButtonLabel(attempts: number): string {
  if (attempts < NO_BUTTON_LABELS.length) {
    return NO_BUTTON_LABELS[attempts];
  }
  // Cycle through extra labels for high attempt counts
  const extraIndex = (attempts - NO_BUTTON_LABELS.length) % EXTRA_NO_LABELS.length;
  return EXTRA_NO_LABELS[extraIndex];
}

export default function InevitableNoButton({ onAttempt, attempts, bounds }: InevitableNoButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [visualState, setVisualState] = useState<{
    transform?: string;
    opacity?: number;
    filter?: string;
    transition?: string;
  }>({});
  const lastInteractionRef = useRef<number>(0);
  
  const getSafePosition = useSafeRandomPosition(bounds);
  const prefersReducedMotion = usePrefersReducedMotion();

  const buttonLabel = getNoButtonLabel(attempts);

  const applyBehavior = (pointerPosition: { x: number; y: number } | null = null, isDeliberate: boolean = false) => {
    // Only count as attempt if it's a deliberate interaction (not just proximity)
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionRef.current;
    
    // Require at least 300ms between counted attempts to avoid over-counting on hover
    if (isDeliberate && timeSinceLastInteraction > 300) {
      lastInteractionRef.current = now;
      onAttempt();
    }

    if (buttonRef.current && bounds.width > 0) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const buttonSize = { width: buttonRect.width, height: buttonRect.height };
      
      // Get the appropriate behavior based on attempts and reduced motion preference
      const behavior = getBehavior(attempts, prefersReducedMotion);
      
      // Execute the behavior
      const result = behavior(
        position,
        pointerPosition,
        bounds,
        buttonSize,
        getSafePosition
      );

      // Apply position if provided
      if (result.position) {
        setPosition(result.position);
      }

      // Apply visual state
      setVisualState({
        transform: result.transform,
        opacity: result.opacity,
        filter: result.filter,
        transition: result.transition,
      });
    }
  };

  // Track pointer movement for proximity detection
  const handlePointerMove = (e: React.PointerEvent) => {
    if (buttonRef.current && attempts >= 3) { // Only start proximity evasion after a few attempts
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      // Trigger evasion when pointer gets close (within 120px for higher attempts)
      const proximityThreshold = Math.max(80, 120 - attempts * 2);
      if (distance < proximityThreshold) {
        setPointerPos({ x: e.clientX, y: e.clientY });
        applyBehavior({ x: e.clientX, y: e.clientY }, false); // Not a deliberate attempt
      }
    }
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    setPointerPos({ x: e.clientX, y: e.clientY });
    applyBehavior({ x: e.clientX, y: e.clientY }, true); // Deliberate attempt
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setPointerPos({ x: e.clientX, y: e.clientY });
    applyBehavior({ x: e.clientX, y: e.clientY }, true); // Deliberate attempt
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Never allow a successful "No" click - the button always evades
  };

  // Reset position when bounds change significantly
  useEffect(() => {
    if (position && bounds.width > 0) {
      const buttonWidth = 160;
      const buttonHeight = 64;
      
      // Check if current position is out of bounds
      if (
        position.x + buttonWidth > bounds.width ||
        position.y + buttonHeight > bounds.height ||
        position.x < 0 ||
        position.y < 0
      ) {
        setPosition(null);
        setVisualState({});
      }
    }
  }, [bounds, position]);

  // Reset visual state after a delay to allow for re-interaction
  useEffect(() => {
    if (visualState.transform || visualState.opacity !== undefined || visualState.filter) {
      const timer = setTimeout(() => {
        setVisualState(prev => ({
          ...prev,
          transform: undefined,
          opacity: 1,
          filter: undefined,
        }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visualState]);

  return (
    <div
      className="relative"
      onPointerMove={handlePointerMove}
      style={{ width: '100%', height: '100%', minHeight: '80px' }}
    >
      <Button
        ref={buttonRef}
        size="lg"
        variant="outline"
        onPointerEnter={handlePointerEnter}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className="h-16 min-w-[160px] rounded-full border-2 text-xl font-semibold transition-all hover:scale-105"
        style={{
          position: position ? 'absolute' : 'relative',
          left: position ? `${position.x}px` : undefined,
          top: position ? `${position.y}px` : undefined,
          transform: visualState.transform,
          opacity: visualState.opacity,
          filter: visualState.filter,
          transition: visualState.transition,
        }}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
