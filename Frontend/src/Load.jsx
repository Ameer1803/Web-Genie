import React, { useEffect, useState } from "react";

export default function Load() {
  const words = [
    "Imagining your world",
    "Designing your layout",
    "Building whats beautiful",
  ];
  const [display, setDisplay] = useState("");
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);

  useEffect(() => {
    let timeout;
    const currentWord = words[i];

    if (j < currentWord.length) {
      // Type in
      setDisplay(currentWord.substring(0, j + 1));
      timeout = setTimeout(() => setJ(j + 1), 100);
    } else {
      // Pause, then clear and go to next word
      timeout = setTimeout(() => {
        setDisplay("");
        setJ(0);
        setI((i + 1) % words.length);
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [i, j, words]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <style>
        {`
          @keyframes pulse-line {
            0%, 100% { transform: scaleX(0.3); transform-origin: center; }
            50% { transform: scaleX(1.1); transform-origin: center; }
          }
          .pulse-line-anim {
            animation: pulse-line 5s ease-in-out infinite;
          }
        `}
      </style>
      <img src="/techbot.svg" alt="Loading" className="w-25 h-40" />
      <div className="relative w-120 h-1 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pulse-line-anim"></div>
      </div>
      <p className="text-xl text-white">{display}</p>
    </div>
  );
}