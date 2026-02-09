# Specification

## Summary
**Goal:** Make the repeated “No” → “Think again” loop feel more varied and playful at high attempt counts, and enhance the Valentine vibe with extra decorative images and lightweight animations, including a bigger “Yes” celebration that scales with prior “No” attempts.

**Planned changes:**
- Expand the “Think again”/teasing feedback copy and evolving “No” button labels so they stay fresh and non-repetitive beyond 30+ “No” attempts (English-only).
- Add an extra celebratory flourish on “Yes” that feels more rewarding, with intensity scaled by the number of prior “No” attempts, and provide reduced-motion-safe alternatives.
- Add new Valentine-themed decorative static images (stickers/doodles/badges) stored under `frontend/public/assets/generated` and referenced directly via `/assets/generated/...`, placed across epilogue/question/success views without blocking readability or interactions and adapting to dark mode.
- Add at least 3 additional cute micro-animations/micro-interactions across epilogue/question/success (e.g., subtle bob/twinkle/shimmer) that avoid layout shifts and respect `prefers-reduced-motion`.

**User-visible outcome:** Repeated “No” clicks produce continuously fresh, playful “think again” responses and evolving button labels even after many attempts; clicking “Yes” triggers an extra satisfying celebration that can get bigger the longer the user resisted; the flow includes more Valentine decorations and subtle animations with accessible reduced-motion behavior.
