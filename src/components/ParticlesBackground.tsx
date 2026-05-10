/**
 * PixelOS-style organic blob backdrop.
 * Large amorphous shapes anchored to corners, gently drifting.
 */
export const ParticlesBackground = () => {
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none">
      {/* Top-left mustard blob */}
      <svg
        className="absolute -top-32 -left-40 w-[42rem] h-[42rem] animate-blob-drift-slow"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fill="hsl(var(--blob-olive) / 0.55)"
          d="M421.3,318.7Q393,387.4,323.6,419.4Q254.2,451.4,189.7,410.4Q125.2,369.4,108.4,289.2Q91.6,209,151.6,156.7Q211.6,104.4,287.4,114.7Q363.2,125,415.6,182.5Q468,240,421.3,318.7Z"
        />
      </svg>

      {/* Top-right cream blob */}
      <svg
        className="absolute -top-40 -right-48 w-[44rem] h-[44rem] animate-blob-drift"
        viewBox="0 0 600 600"
        style={{ animationDelay: '2s' }}
        aria-hidden
      >
        <path
          fill="hsl(var(--blob-white) / 0.95)"
          d="M438.2,321.9Q406,393.8,331.1,425.6Q256.2,457.4,184.4,420.5Q112.6,383.6,98.4,295.7Q84.2,207.8,151.4,153.6Q218.6,99.4,294.7,113.6Q370.8,127.8,425.5,181.4Q480.2,235,438.2,321.9Z"
        />
      </svg>

      {/* Bottom-left bright yellow blob */}
      <svg
        className="absolute -bottom-32 -left-32 w-[38rem] h-[38rem] animate-blob-drift"
        viewBox="0 0 600 600"
        style={{ animationDelay: '4s' }}
        aria-hidden
      >
        <path
          fill="hsl(var(--blob-yellow) / 0.85)"
          d="M427.9,310.4Q397,370.8,335.7,406.7Q274.4,442.6,200.6,418.4Q126.8,394.2,108.7,310.5Q90.6,226.8,144.4,168.5Q198.2,110.2,275.4,109.6Q352.6,109,407.1,168.7Q461.6,228.4,427.9,310.4Z"
        />
      </svg>

      {/* Bottom-right mint blob */}
      <svg
        className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] animate-blob-drift-slow"
        viewBox="0 0 600 600"
        style={{ animationDelay: '1s' }}
        aria-hidden
      >
        <path
          fill="hsl(var(--blob-mint) / 0.7)"
          d="M433.4,307.2Q401.8,374.4,338.3,408.7Q274.8,443,201.4,420.7Q128,398.4,103.7,318.7Q79.4,239,135.6,180.7Q191.8,122.4,270.6,118.4Q349.4,114.4,409.5,170.7Q469.6,227,433.4,307.2Z"
        />
      </svg>
    </div>
  );
};
