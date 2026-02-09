import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useSafeRandomPosition } from './useSafeRandomPosition';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { getBehavior, getPreEvasionBehavior } from './noButtonBehaviors';

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

// Extended base labels
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

// Expanded cycling labels with more "think again" style variants
const EXTRA_NO_LABELS = [
  'Still no? 😅',
  'Think twice! 🤔',
  'Seriously? 🙃',
  'Rethink this! 💭',
  'Not giving up? 💪',
  'Reconsider! 🔄',
  'Try again! 🎯',
  'Think harder! 🧠',
  'Nope! 🚫',
  'Ponder more! 💡',
  'Keep trying! 😄',
  'Reflect! 🪞',
  'Almost! 🎪',
  'Contemplate! 🌟',
  'So close! 🎲',
  'Meditate on it! 🧘',
  'Nice try! 🎭',
  'Think deeper! 🌊',
  'Oops! 🎨',
  'Recalculate! 🔢',
  'Think positive! ✨',
  'Reassess! 📊',
  'Think love! 💕',
  'Reevaluate! 📝',
  'Think happy! 😊',
  'Think magic! ✨',
  'Think romance! 💖',
  'Think us! 👫',
];

// Template-based labels for very high attempts
const LABEL_TEMPLATES = [
  'Think #{N}! 🤔',
  'Attempt #{N}! 🎯',
  'Try #{N}! 💫',
  'Round #{N}! 🔄',
  'Go #{N}! 🚀',
];

// Threshold before evasive movement starts
const EVADE_START_ATTEMPTS = 3;

function getNoButtonLabel(attempts: number): string {
  if (attempts < NO_BUTTON_LABELS.length) {
    return NO_BUTTON_LABELS[attempts];
  }
  
  // For attempts 15-50, use extended pool
  if (attempts < 50) {
    const extraIndex = (attempts - NO_BUTTON_LABELS.length) % EXTRA_NO_LABELS.length;
    return EXTRA_NO_LABELS[extraIndex];
  }
  
  // For 50+, mix templates with pool
  if (attempts % 5 === 0) {
    const templateIndex = Math.floor(attempts / 5) % LABEL_TEMPLATES.length;
    return LABEL_TEMPLATES[templateIndex].replace('{N}', attempts.toString());
  } else {
    const extraIndex = (attempts - NO_BUTTON_LABELS.length) % EXTRA_NO_LABELS.length;
    return EXTRA_NO_LABELS[extraIndex];
  }
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
  const isEvading = attempts >= EVADE_START_ATTEMPTS;

  const applyBehavior = (pointerPosition: { x: number; y: number } | null = null, isDeliberate: boolean = false) => {
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionRef.current;
    
    if (isDeliberate && timeSinceLastInteraction > 300) {
      lastInteractionRef.current = now;
      onAttempt();
    }

    // Get button size
    const buttonSize = buttonRef.current 
      ? { width: buttonRef.current.offsetWidth, height: buttonRef.current.offsetHeight }
      : { width: 160, height: 64 }; // Default size

    if (!isEvading) {
      const behaviorFn = getPreEvasionBehavior(attempts, prefersReducedMotion);
      const behaviorResult = behaviorFn(position, pointerPosition, bounds, buttonSize, getSafePosition);
      setVisualState({
        transform: behaviorResult.transform,
        opacity: behaviorResult.opacity,
        filter: behaviorResult.filter,
        transition: behaviorResult.transition,
      });
      return;
    }

    const behaviorFn = getBehavior(attempts, prefersReducedMotion);
    const behaviorResult = behaviorFn(position, pointerPosition, bounds, buttonSize, getSafePosition);

    // Update position if behavior includes it
    if (behaviorResult.position) {
      setPosition(behaviorResult.position);
    }

    // Update visual state
    setVisualState({
      transform: behaviorResult.transform,
      opacity: behaviorResult.opacity,
      filter: behaviorResult.filter,
      transition: behaviorResult.transition,
    });
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent | React.FocusEvent, isDeliberate: boolean = false) => {
    let clientX: number, clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      applyBehavior(null, isDeliberate);
      return;
    }

    const pointerPosition = {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    };

    setPointerPos(pointerPosition);
    applyBehavior(pointerPosition, isDeliberate);
  };

  useEffect(() => {
    if (!isEvading || prefersReducedMotion) return;

    const handleGlobalPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!buttonRef.current) return;

      let clientX: number, clientY: number;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(clientX - buttonCenterX, 2) + Math.pow(clientY - buttonCenterY, 2)
      );

      // Check proximity threshold (150px is a reasonable default)
      const proximityThreshold = 150;
      if (distance < proximityThreshold) {
        const pointerPosition = {
          x: clientX - bounds.left,
          y: clientY - bounds.top,
        };
        setPointerPos(pointerPosition);
        applyBehavior(pointerPosition, false);
      }
    };

    window.addEventListener('mousemove', handleGlobalPointerMove);
    window.addEventListener('touchmove', handleGlobalPointerMove);

    return () => {
      window.removeEventListener('mousemove', handleGlobalPointerMove);
      window.removeEventListener('touchmove', handleGlobalPointerMove);
    };
  }, [isEvading, attempts, bounds, prefersReducedMotion]);

  const buttonStyle: React.CSSProperties = position
    ? {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: visualState.transform || 'translate(-50%, -50%)',
        opacity: visualState.opacity ?? 1,
        filter: visualState.filter,
        transition: visualState.transition || 'all 0.3s ease-out',
      }
    : {
        transform: visualState.transform,
        opacity: visualState.opacity ?? 1,
        filter: visualState.filter,
        transition: visualState.transition || 'all 0.3s ease-out',
      };

  return (
    <>
      <Button
        ref={buttonRef}
        size="lg"
        variant="outline"
        onMouseEnter={(e) => handleInteraction(e, false)}
        onTouchStart={(e) => handleInteraction(e, false)}
        onFocus={(e) => handleInteraction(e, false)}
        onClick={(e) => handleInteraction(e, true)}
        className="h-16 min-w-[160px] rounded-full border-2 text-xl font-semibold"
        style={buttonStyle}
      >
        {buttonLabel}
      </Button>
      {position && (
        <div
          className="pointer-events-none h-16 min-w-[160px] rounded-full opacity-0"
          aria-hidden="true"
        />
      )}
    </>
  );
}
