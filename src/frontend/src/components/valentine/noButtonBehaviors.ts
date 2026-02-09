interface Bounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

interface Position {
  x: number;
  y: number;
}

export interface BehaviorResult {
  position?: Position;
  transform?: string;
  opacity?: number;
  filter?: string;
  transition?: string;
  label?: string;
}

export type BehaviorFunction = (
  currentPos: Position | null,
  pointerPos: { x: number; y: number } | null,
  bounds: Bounds,
  buttonSize: { width: number; height: number },
  getSafePosition: (width: number, height: number, options?: any) => Position
) => BehaviorResult;

// Pre-evasion behaviors: subtle visual feedback without position changes
export const PRE_EVASION_BEHAVIORS: Record<number, BehaviorFunction> = {
  0: () => ({}), // No effect on first render
  
  1: () => ({
    transform: 'scale(0.98)',
    transition: 'all 0.2s ease-out',
  }),
  
  2: () => ({
    transform: 'scale(0.96)',
    opacity: 0.95,
    transition: 'all 0.2s ease-out',
  }),
};

// Reduced-motion pre-evasion behaviors
export const PRE_EVASION_REDUCED_MOTION: Record<number, BehaviorFunction> = {
  0: () => ({}),
  
  1: () => ({
    opacity: 0.95,
    transition: 'opacity 0.2s ease-out',
  }),
  
  2: () => ({
    opacity: 0.9,
    transition: 'opacity 0.2s ease-out',
  }),
};

// Behavior map: escalating evasive patterns (used after threshold)
export const NO_BUTTON_BEHAVIORS: Record<number, BehaviorFunction> = {
  // 0-1: Simple teleport away
  0: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }),

  // 1: Edge hugging - move to nearest edge
  1: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { edgeBias: true }),
    transition: 'all 0.4s ease-out',
  }),

  // 2: Shrink and dodge
  2: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transform: 'scale(0.8)',
    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }),

  // 3: Pointer repulsion - move away from pointer
  3: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { 
      repelFrom: pointerPos 
    }),
    transition: 'all 0.25s ease-out',
  }),

  // 4: Rotation tilt with move
  4: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transform: 'rotate(-15deg)',
    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }),

  // 5: Opacity tease - fade and move
  5: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.5,
    transition: 'all 0.3s ease-in-out',
  }),

  // 6: Blur escape
  6: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    filter: 'blur(2px)',
    transition: 'all 0.3s ease-out',
  }),

  // 7: Multi-hop - quick double move
  7: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { multiHop: 2 }),
    transition: 'all 0.2s ease-in-out',
  }),

  // 8: Grow and flee
  8: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transform: 'scale(1.2)',
    transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }),

  // 9: Corner escape - move to random corner
  9: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { cornerBias: true }),
    transition: 'all 0.5s ease-in-out',
  }),

  // 10: Spin and dodge
  10: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transform: 'rotate(360deg) scale(0.9)',
    transition: 'all 0.4s ease-out',
  }),

  // 11: Fade out and reappear elsewhere
  11: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.3,
    filter: 'blur(1px)',
    transition: 'all 0.25s ease-in-out',
  }),

  // 12: Maximum evasion - combine effects
  12: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { 
      repelFrom: pointerPos,
      edgeBias: true 
    }),
    transform: 'rotate(-10deg) scale(0.85)',
    opacity: 0.7,
    transition: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }),
};

// Additional cycling behaviors for very high attempt counts
const CYCLING_BEHAVIORS: BehaviorFunction[] = [
  // Zigzag escape
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { repelFrom: pointerPos }),
    transform: 'rotate(25deg) scale(0.95)',
    transition: 'all 0.3s ease-out',
  }),
  // Fade and spin
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transform: 'rotate(-180deg)',
    opacity: 0.6,
    transition: 'all 0.35s ease-in-out',
  }),
  // Shrink to corner
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { cornerBias: true }),
    transform: 'scale(0.7)',
    transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }),
  // Blur and grow
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transform: 'scale(1.15)',
    filter: 'blur(1.5px)',
    transition: 'all 0.3s ease-out',
  }),
  // Edge slide
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { edgeBias: true }),
    transform: 'rotate(15deg)',
    opacity: 0.8,
    transition: 'all 0.25s ease-in-out',
  }),
];

// Reduced-motion variants (non-motion alternatives)
export const REDUCED_MOTION_BEHAVIORS: Record<number, BehaviorFunction> = {
  0: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transition: 'all 0.15s ease-out',
  }),

  1: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.9,
    transition: 'opacity 0.2s ease-out, left 0.15s ease-out, top 0.15s ease-out',
  }),

  2: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.85,
    transition: 'all 0.15s ease-out',
  }),

  3: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { 
      repelFrom: pointerPos 
    }),
    transition: 'all 0.15s ease-out',
  }),

  4: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    filter: 'brightness(0.9)',
    transition: 'all 0.15s ease-out',
  }),

  5: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.8,
    transition: 'all 0.15s ease-out',
  }),

  6: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.75,
    transition: 'all 0.15s ease-out',
  }),

  7: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    transition: 'all 0.1s ease-out',
  }),

  8: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    filter: 'brightness(1.1)',
    transition: 'all 0.15s ease-out',
  }),

  9: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { cornerBias: true }),
    transition: 'all 0.2s ease-out',
  }),

  10: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.7,
    transition: 'all 0.15s ease-out',
  }),

  11: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.65,
    transition: 'all 0.15s ease-out',
  }),

  12: (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { 
      repelFrom: pointerPos 
    }),
    opacity: 0.6,
    transition: 'all 0.1s ease-out',
  }),
};

// Cycling reduced-motion behaviors for high attempts
const CYCLING_REDUCED_MOTION: BehaviorFunction[] = [
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height),
    opacity: 0.55,
    transition: 'all 0.15s ease-out',
  }),
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { repelFrom: pointerPos }),
    filter: 'brightness(0.85)',
    transition: 'all 0.15s ease-out',
  }),
  (currentPos, pointerPos, bounds, buttonSize, getSafePosition) => ({
    position: getSafePosition(buttonSize.width, buttonSize.height, { cornerBias: true }),
    opacity: 0.7,
    transition: 'all 0.2s ease-out',
  }),
];

export function getPreEvasionBehavior(attempts: number, reducedMotion: boolean): BehaviorFunction {
  const behaviors = reducedMotion ? PRE_EVASION_REDUCED_MOTION : PRE_EVASION_BEHAVIORS;
  
  if (behaviors[attempts]) {
    return behaviors[attempts];
  }
  
  // Return the last defined pre-evasion behavior
  const maxAttempt = Math.max(...Object.keys(behaviors).map(Number));
  return behaviors[maxAttempt];
}

export function getBehavior(attempts: number, reducedMotion: boolean): BehaviorFunction {
  const behaviors = reducedMotion ? REDUCED_MOTION_BEHAVIORS : NO_BUTTON_BEHAVIORS;
  const cyclingBehaviors = reducedMotion ? CYCLING_REDUCED_MOTION : CYCLING_BEHAVIORS;
  
  // Use the behavior for the current attempt if defined
  if (behaviors[attempts]) {
    return behaviors[attempts];
  }
  
  // For attempts beyond the defined behaviors, cycle through the additional behaviors
  const maxDefinedAttempt = Math.max(...Object.keys(behaviors).map(Number));
  if (attempts > maxDefinedAttempt) {
    const cycleIndex = (attempts - maxDefinedAttempt - 1) % cyclingBehaviors.length;
    return cyclingBehaviors[cycleIndex];
  }
  
  // Fallback to the last defined behavior
  return behaviors[maxDefinedAttempt];
}
