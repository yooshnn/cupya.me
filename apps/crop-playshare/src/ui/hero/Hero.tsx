import { useEffect, useState } from 'react';

export function Hero() {
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCropping(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full mx-auto fade-up p-8 pb-4 sm:p-12">
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/30 to-transparent pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[80%] rounded-sm">
        <img
          src="assets/hero.png"
          alt="크롭 화면"
          className="w-full h-auto block"
        />

        {/* Crop Overlay UI */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: isCropping ? '0px' : '-48px',
            right: isCropping ? '0px' : '-48px',
            bottom: isCropping ? '0px' : '-48px',
            left: isCropping ? '0px' : '-48px',
            opacity: isCropping ? 1 : 0,
            transition: `
              opacity 0.4s ease-out,
              top 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s,
              right 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s,
              bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s,
              left 0.4s cubic-bezier(0.16, 1, 0.3, 1) 1.1s
            `,
          }}
        >
          <div className="absolute top-1/3 left-0 w-full border-t border-white/50"></div>
          <div className="absolute top-2/3 left-0 w-full border-t border-white/50"></div>
          <div className="absolute left-1/3 top-0 h-full border-l border-white/50"></div>
          <div className="absolute left-2/3 top-0 h-full border-l border-white/50"></div>

          <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-4 border-l-4 border-white"></div>
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-4 border-r-4 border-white"></div>
          <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-4 border-l-4 border-white"></div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-4 border-r-4 border-white"></div>
        </div>
      </div>

      <p className="font-mono mt-4 text-primary text-sm font-medium">Playshare auto-crop for pop'n music</p>
    </div>
  );
}
