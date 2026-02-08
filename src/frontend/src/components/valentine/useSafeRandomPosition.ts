interface Bounds {
  width: number;
  height: number;
  top: number;
  left: number;
}

interface PositionOptions {
  edgeBias?: boolean;
  cornerBias?: boolean;
  repelFrom?: { x: number; y: number } | null;
  multiHop?: number;
}

export function useSafeRandomPosition(bounds: Bounds) {
  return (
    buttonWidth: number, 
    buttonHeight: number, 
    options: PositionOptions = {}
  ): { x: number; y: number } => {
    const padding = 20;
    const yesButtonReservedWidth = 200;
    const yesButtonReservedHeight = 100;

    // Calculate safe area (avoiding the center where Yes button is)
    const maxX = bounds.width - buttonWidth - padding;
    const maxY = bounds.height - buttonHeight - padding;

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    let x: number;
    let y: number;

    // Edge bias: prefer positions near edges
    if (options.edgeBias) {
      const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
      switch (edge) {
        case 0: // top
          x = Math.random() * maxX + padding;
          y = padding;
          break;
        case 1: // right
          x = maxX;
          y = Math.random() * maxY + padding;
          break;
        case 2: // bottom
          x = Math.random() * maxX + padding;
          y = maxY;
          break;
        case 3: // left
          x = padding;
          y = Math.random() * maxY + padding;
          break;
        default:
          x = Math.random() * maxX + padding;
          y = Math.random() * maxY + padding;
      }
    }
    // Corner bias: prefer corner positions
    else if (options.cornerBias) {
      const corner = Math.floor(Math.random() * 4);
      const cornerPadding = 40;
      switch (corner) {
        case 0: // top-left
          x = padding + cornerPadding;
          y = padding + cornerPadding;
          break;
        case 1: // top-right
          x = maxX - cornerPadding;
          y = padding + cornerPadding;
          break;
        case 2: // bottom-right
          x = maxX - cornerPadding;
          y = maxY - cornerPadding;
          break;
        case 3: // bottom-left
          x = padding + cornerPadding;
          y = maxY - cornerPadding;
          break;
        default:
          x = Math.random() * maxX + padding;
          y = Math.random() * maxY + padding;
      }
    }
    // Repel from pointer: move away from pointer position
    else if (options.repelFrom) {
      const pointer = options.repelFrom;
      const repelDistance = 200;
      
      // Calculate direction away from pointer
      const dx = centerX - pointer.x;
      const dy = centerY - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        x = centerX + normalizedDx * repelDistance;
        y = centerY + normalizedDy * repelDistance;
      } else {
        x = Math.random() * maxX + padding;
        y = Math.random() * maxY + padding;
      }
    }
    // Default: random position
    else {
      x = Math.random() * maxX + padding;
      y = Math.random() * maxY + padding;
    }

    // Ensure position doesn't overlap with Yes button (center area)
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      const overlapsYesButton =
        x < centerX + yesButtonReservedWidth / 2 &&
        x + buttonWidth > centerX - yesButtonReservedWidth / 2 &&
        y < centerY + yesButtonReservedHeight / 2 &&
        y + buttonHeight > centerY - yesButtonReservedHeight / 2;

      if (!overlapsYesButton) {
        break;
      }

      // Try a new random position if overlapping
      x = Math.random() * maxX + padding;
      y = Math.random() * maxY + padding;
      attempts++;
    }

    // Ensure position is within bounds
    x = Math.max(padding, Math.min(x, maxX));
    y = Math.max(padding, Math.min(y, maxY));

    return { x, y };
  };
}
