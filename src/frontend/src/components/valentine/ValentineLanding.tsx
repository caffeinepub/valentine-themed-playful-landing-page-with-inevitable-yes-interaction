import { useState } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import InevitableNoButton from './InevitableNoButton';
import CelebrationOverlay from './CelebrationOverlay';
import ResponsiveStage from './ResponsiveStage';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type AppState = 'epilogue' | 'question' | 'celebrating';

// Expanded feedback messages with high-entropy variety
const FEEDBACK_MESSAGES = [
  '', // 0 attempts
  "Wait, don't you want to know what happens if you say yes? 💕",
  "I promise this will be the best decision you make today! 💖",
  "Come on, Akriti... you know you're curious! 🥺",
  "What if I told you saying yes unlocks something magical? ✨",
  "The universe is literally conspiring for you to say yes! 🌟",
  "Even this button doesn't want you to say no... see? 😊",
  "Plot twist: The 'No' button is actually allergic to being clicked! 😄",
  "Fun fact: 100% of people who said yes were happy they did! 💫",
  "I've got chocolates, flowers, and endless affection waiting... 🍫🌹",
  "Saying yes is scientifically proven to increase happiness by 1000%! 📊",
  "The button is running away because it knows yes is the right answer! 🏃",
  "Akriti, even the laws of physics are on my side here! 🔬",
  "What if I said pretty please with a cherry on top? 🍒",
  "This is your sign from the universe to say YES! 🎯",
  "The button has given up... but my hope in you never will! 💝",
  "Okay, I'll be honest: I really, REALLY want you to say yes! 💗",
  "You're making this adorably difficult, but I'm not giving up! 😊",
  "Fun challenge: Try to click 'No' successfully. Spoiler: You can't! 🎮",
  "At this point, saying yes is inevitable... embrace it! 💘",
];

// Extended cycling messages for unlimited attempts with more variety
const EXTRA_TEASING_POOL = [
  "Akriti, you're incredibly persistent... I admire that! But yes is still the answer! 💕",
  "The button is exhausted, I'm hopeful, and you're amazing! Say yes? 😊",
  "Plot twist: This whole time, you actually wanted to say yes! 💝",
  "I've prepared a whole speech for when you say yes... don't let it go to waste! 🎭",
  "Breaking news: Local person too stubborn to accept happiness! (Just kidding, I love you!) 💖",
  "You know what? Your determination is actually really cute! But still... yes? 🥰",
  "I could do this all day! The button? Not so much. Help it out and say yes! 😄",
  "Imagine all the wonderful moments we'll share when you finally say yes! 🌈",
  "The 'No' button is filing a restraining order against your cursor! 😂",
  "Every time you try to click 'No', an angel gets its wings... and flies away with the button! 👼",
  "You're testing my patience... just kidding, I have infinite patience for you! 💗",
  "This is like a romantic comedy, except the ending is you saying YES! 🎬",
  "The button is playing hard to get, but I know you're not! Right? 😉",
  "Fun fact: The word 'No' doesn't exist in the language of love! 💕",
  "Your persistence is legendary! But so is my hope that you'll say yes! ⭐",
  "Think of all the cute dates we could go on if you just say yes! 🎡",
  "The button is getting dizzy from all this running around! 🌀",
  "I'm starting to think you enjoy watching the button escape! 😏",
  "Confession: I've been practicing my happy dance for when you say yes! 💃",
  "The button just asked me if it can retire... please say yes! 🏖️",
  "You're making history here - most creative 'No' attempts ever! But... yes? 🏆",
  "I bet you're smiling right now... that's a good sign! Say yes! 😁",
  "The button has developed trust issues... help me help it! 💔➡️💖",
  "If persistence was a superpower, you'd be a superhero! Now use it to say yes! 🦸",
  "The button is writing its memoirs: 'The Day I Ran From Love' 📖",
  "You've unlocked achievement: 'Master of Evasion'! Next: 'Master of Yes'! 🎮",
  "I'm not saying the button is scared... but it's definitely scared! 😱",
  "Think again! (See what I did there? 😉) But seriously... yes?",
  "The button's GPS shows it's been to 47 different locations! 🗺️",
  "You're so close to making both of us incredibly happy! Just one yes! 🎯",
];

// Template-based message generation for even higher entropy
function generateDynamicMessage(attempts: number): string {
  const templates = [
    `Attempt #${attempts}: The button is getting more creative with its escapes! 🎪`,
    `${attempts} tries and counting! Your determination is impressive! 💪`,
    `The button has now traveled ${attempts * 10} pixels trying to escape! 📏`,
    `Fun stat: You've spent ${attempts * 2} seconds not saying yes! ⏱️`,
    `The button's fitness tracker shows ${attempts} evasive maneuvers! 🏃‍♂️`,
    `After ${attempts} attempts, the button is considering a career change! 💼`,
    `${attempts} times you've made me smile watching this! Now say yes? 😊`,
    `The button has filed ${attempts} complaints about working conditions! 📋`,
  ];
  return templates[attempts % templates.length];
}

function getFeedbackMessage(attempts: number): string {
  if (attempts === 0) return '';
  if (attempts < FEEDBACK_MESSAGES.length) {
    return FEEDBACK_MESSAGES[attempts];
  }
  
  // For attempts 20-50, use the extended pool
  if (attempts < 50) {
    const extraIndex = (attempts - FEEDBACK_MESSAGES.length) % EXTRA_TEASING_POOL.length;
    return EXTRA_TEASING_POOL[extraIndex];
  }
  
  // For 50+, mix dynamic templates with pool messages
  if (attempts % 3 === 0) {
    return generateDynamicMessage(attempts);
  } else {
    const extraIndex = (attempts - FEEDBACK_MESSAGES.length) % EXTRA_TEASING_POOL.length;
    return EXTRA_TEASING_POOL[extraIndex];
  }
}

export default function ValentineLanding() {
  const [state, setState] = useState<AppState>('epilogue');
  const [noAttempts, setNoAttempts] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEpilogueYes = () => {
    setState('question');
  };

  const handleYes = () => {
    setState('celebrating');
  };

  const handleNoAttempt = () => {
    setNoAttempts((prev) => prev + 1);
  };

  const handleRestart = () => {
    setState('epilogue');
    setNoAttempts(0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/assets/generated/valentine-bg.dim_1920x1080.png"
          alt=""
          className="h-full w-full object-cover opacity-40 dark:opacity-20"
        />
        <div className="absolute inset-0 valentine-gradient dark:valentine-gradient-dark" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {state === 'epilogue' ? (
          <div className="w-full max-w-2xl animate-scale-in">
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/95 p-8 shadow-valentine-lg backdrop-blur-sm md:p-12 epilogue-card">
              {/* Decorative floating hearts */}
              <div className="absolute -right-4 -top-4 text-primary/10">
                <Heart className={`h-24 w-24 fill-current ${prefersReducedMotion ? '' : 'heart-float'}`} />
              </div>
              <div className="absolute -bottom-4 -left-4 text-accent/10">
                <Heart className={`h-20 w-20 fill-current ${prefersReducedMotion ? '' : 'heart-float'}`} style={{ animationDelay: '1s' }} />
              </div>
              <div className="absolute right-12 top-12 text-secondary/10">
                <Sparkles className={`h-16 w-16 ${prefersReducedMotion ? '' : 'sparkle'}`} />
              </div>

              {/* Decorative stickers - new micro-animation */}
              <img
                src="/assets/generated/valentine-stickers-set.dim_1024x1024.png"
                alt=""
                className={`pointer-events-none absolute -left-8 top-1/4 h-32 w-32 opacity-20 dark:opacity-10 ${prefersReducedMotion ? '' : 'sticker-bob'}`}
              />
              <img
                src="/assets/generated/valentine-stickers-set.dim_1024x1024.png"
                alt=""
                className={`pointer-events-none absolute -right-8 bottom-1/4 h-28 w-28 opacity-20 dark:opacity-10 ${prefersReducedMotion ? '' : 'sticker-bob'}`}
                style={{ animationDelay: '1.5s' }}
              />

              {/* Epilogue Content */}
              <div className="relative z-10 text-center">
                <div className="mb-8 flex justify-center">
                  <div className={`relative ${prefersReducedMotion ? '' : 'animate-pulse-gentle'}`}>
                    <Heart className="h-32 w-32 fill-primary text-primary md:h-40 md:w-40" />
                    <div className="absolute -right-2 -top-2 text-accent">
                      <Sparkles className={`h-8 w-8 ${prefersReducedMotion ? '' : 'sparkle'}`} />
                    </div>
                  </div>
                </div>

                <h1 className={`mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl ${prefersReducedMotion ? '' : 'heading-shimmer'}`}>
                  Do you wanna know a secret? ✨
                </h1>
                <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
                  Something special is waiting for you... 💫
                </p>

                <Button
                  onClick={handleEpilogueYes}
                  size="lg"
                  className={`group relative h-16 min-w-[200px] overflow-hidden rounded-full bg-primary text-xl font-semibold text-primary-foreground shadow-valentine transition-all hover:scale-110 hover:shadow-valentine-lg ${prefersReducedMotion ? '' : 'button-glow'}`}
                >
                  <Sparkles className="mr-2 h-6 w-6 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                  Tell me!
                </Button>
              </div>
            </Card>
          </div>
        ) : state === 'question' ? (
          <ResponsiveStage>
            {(containerRef, bounds) => (
              <div ref={containerRef} className="relative w-full max-w-2xl">
                <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/95 p-8 shadow-valentine-lg backdrop-blur-sm md:p-12 question-card">
                  {/* Decorative hearts with enhanced animations */}
                  <div className="absolute -right-4 -top-4 text-primary/10">
                    <Heart className={`h-24 w-24 fill-current ${prefersReducedMotion ? '' : 'heart-float'}`} />
                  </div>
                  <div className="absolute -bottom-4 -left-4 text-accent/10">
                    <Heart className={`h-20 w-20 fill-current ${prefersReducedMotion ? '' : 'heart-float'}`} style={{ animationDelay: '1s' }} />
                  </div>
                  <div className="absolute right-16 top-16 text-secondary/10">
                    <Star className={`h-12 w-12 ${prefersReducedMotion ? '' : 'sparkle-rotate'}`} />
                  </div>
                  <div className="absolute left-16 bottom-16 text-accent/10">
                    <Star className={`h-10 w-10 ${prefersReducedMotion ? '' : 'sparkle-rotate'}`} style={{ animationDelay: '0.7s' }} />
                  </div>

                  {/* Decorative garland - new image */}
                  <img
                    src="/assets/generated/valentine-heart-garland.dim_1600x400.png"
                    alt=""
                    className={`pointer-events-none absolute left-0 right-0 top-0 h-16 w-full object-cover opacity-15 dark:opacity-8 ${prefersReducedMotion ? '' : 'garland-sway'}`}
                  />

                  {/* Decorative stickers */}
                  <img
                    src="/assets/generated/valentine-stickers-set.dim_1024x1024.png"
                    alt=""
                    className={`pointer-events-none absolute -left-6 top-1/3 h-24 w-24 opacity-20 dark:opacity-10 ${prefersReducedMotion ? '' : 'sticker-bob'}`}
                  />
                  <img
                    src="/assets/generated/valentine-stickers-set.dim_1024x1024.png"
                    alt=""
                    className={`pointer-events-none absolute -right-6 bottom-1/3 h-20 w-20 opacity-20 dark:opacity-10 ${prefersReducedMotion ? '' : 'sticker-bob'}`}
                    style={{ animationDelay: '1.2s' }}
                  />

                  {/* Hero Illustration */}
                  <div className="mb-8 flex justify-center">
                    <div className="relative">
                      <img
                        src="/assets/generated/valentine-hero-illustration.dim_1200x900.png"
                        alt="Valentine illustration"
                        className={`h-48 w-auto md:h-64 ${prefersReducedMotion ? 'animate-fade-in' : 'animate-scale-in'}`}
                      />
                      <div className={`absolute -right-2 -top-2 text-primary ${prefersReducedMotion ? '' : 'sparkle-pulse'}`}>
                        <Heart className="h-6 w-6 fill-current" />
                      </div>
                      <div className={`absolute -left-2 bottom-4 text-accent ${prefersReducedMotion ? '' : 'sparkle-pulse'}`} style={{ animationDelay: '0.5s' }}>
                        <Heart className="h-5 w-5 fill-current" />
                      </div>
                      <div className={`absolute right-8 bottom-2 text-secondary ${prefersReducedMotion ? '' : 'sparkle-pulse twinkle'}`} style={{ animationDelay: '0.3s' }}>
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-8 text-center">
                    <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                      Will you be my valentine Akriti? 💖
                    </h1>
                    {/* Feedback area with min-height to prevent layout shift */}
                    <div className="min-h-[3rem] animate-fade-in">
                      {noAttempts > 0 && (
                        <p className={`text-lg text-muted-foreground md:text-xl ${prefersReducedMotion ? '' : 'animate-bounce-subtle'}`}>
                          {getFeedbackMessage(noAttempts)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="relative flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <Button
                      onClick={handleYes}
                      size="lg"
                      className={`group relative z-10 h-16 min-w-[160px] overflow-hidden rounded-full bg-primary text-xl font-semibold text-primary-foreground shadow-valentine transition-all hover:scale-110 hover:shadow-valentine-lg ${prefersReducedMotion ? '' : 'button-glow'}`}
                    >
                      <Heart className="mr-2 h-6 w-6 fill-current transition-transform group-hover:scale-125 group-hover:rotate-12" />
                      Yes! 💕
                    </Button>

                    <InevitableNoButton
                      onAttempt={handleNoAttempt}
                      attempts={noAttempts}
                      bounds={bounds}
                    />
                  </div>
                </Card>
              </div>
            )}
          </ResponsiveStage>
        ) : (
          <div className={`w-full max-w-2xl ${prefersReducedMotion ? 'animate-fade-in' : 'animate-scale-in'}`}>
            <Card className="relative overflow-hidden border-2 border-primary/30 bg-card/95 p-8 text-center shadow-valentine-lg backdrop-blur-sm md:p-12 success-card love-note">
              {/* Decorative love note paper background */}
              <img
                src="/assets/generated/valentine-love-note-paper.dim_1600x1200.png"
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 dark:opacity-5"
              />

              {/* Decorative elements with enhanced animations */}
              <div className="absolute -right-8 -top-8 text-primary/5">
                <Heart className="h-40 w-40 fill-current" />
              </div>
              <div className="absolute -bottom-8 -left-8 text-accent/5">
                <Heart className="h-36 w-36 fill-current" />
              </div>
              <div className="absolute right-12 top-12 text-secondary/10">
                <Sparkles className={`h-12 w-12 ${prefersReducedMotion ? '' : 'sparkle twinkle'}`} />
              </div>
              <div className="absolute left-12 bottom-12 text-accent/10">
                <Star className={`h-10 w-10 ${prefersReducedMotion ? '' : 'sparkle-rotate'}`} />
              </div>

              {/* Decorative stickers */}
              <img
                src="/assets/generated/valentine-stickers-set.dim_1024x1024.png"
                alt=""
                className={`pointer-events-none absolute left-4 top-4 h-20 w-20 opacity-25 dark:opacity-15 ${prefersReducedMotion ? '' : 'sticker-bob'}`}
              />
              <img
                src="/assets/generated/valentine-stickers-set.dim_1024x1024.png"
                alt=""
                className={`pointer-events-none absolute right-4 bottom-4 h-20 w-20 opacity-25 dark:opacity-15 ${prefersReducedMotion ? '' : 'sticker-bob'}`}
                style={{ animationDelay: '0.8s' }}
              />

              {/* Give-in flourish badge */}
              {noAttempts > 10 && (
                <div className={`absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-sm ${prefersReducedMotion ? 'animate-fade-in' : 'final-flourish'}`}>
                  {noAttempts > 30 ? '🏆 Legendary Persistence!' : noAttempts > 20 ? '⭐ Epic Journey!' : '💫 Worth the wait!'}
                </div>
              )}

              {/* Success Content */}
              <div className="relative z-10">
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <Heart className={`h-32 w-32 fill-primary text-primary md:h-40 md:w-40 ${prefersReducedMotion ? '' : 'pulse-heart'}`} />
                    <div className={`absolute -right-4 -top-4 text-accent ${prefersReducedMotion ? '' : 'sparkle'}`}>
                      <Sparkles className="h-10 w-10" />
                    </div>
                    <div className={`absolute -left-4 -bottom-4 text-secondary ${prefersReducedMotion ? '' : 'sparkle'}`} style={{ animationDelay: '0.3s' }}>
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <div className={`absolute right-0 bottom-0 text-primary ${prefersReducedMotion ? '' : 'sparkle-pulse twinkle'}`} style={{ animationDelay: '0.6s' }}>
                      <Star className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <h2 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                  My cute little baby 💕✨
                </h2>
                
                <div className="mx-auto max-w-xl space-y-6">
                  <p className="text-xl leading-relaxed text-muted-foreground md:text-2xl">
                    You mean so much to me and you are really adorable! 🥰
                  </p>
                  
                  <p className="text-lg leading-relaxed text-muted-foreground/90 md:text-xl">
                    I can't wait to make every moment for us special and even better and I really am looking forward for you and me as life long partners. Every moment with you is gonna be like the treasure, and I'm grateful that you really look forward too! Cheers to our love~ 🥂💖
                  </p>
                </div>

                <div className="mt-10">
                  <Button
                    onClick={handleRestart}
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full border-2 border-primary/30 px-8 text-lg font-semibold transition-all hover:scale-105 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Heart className="mr-2 h-5 w-5 fill-current" />
                    Ask me again! 💖
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Celebration Overlay with intensity */}
      {state === 'celebrating' && <CelebrationOverlay intensity={noAttempts} />}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-background/80 py-4 text-center text-sm text-muted-foreground backdrop-blur-sm">
        © 2026. Built with <Heart className="inline h-4 w-4 fill-primary text-primary" /> using{' '}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
