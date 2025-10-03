import React from "react";
import { useNavigate } from "react-router-dom";
import LightRays from '../components/ui/LightRays';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black px-4">
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-violet-300 mb-6 drop-shadow-lg">NEXUS</h1>
        <p className="text-lg md:text-2xl mb-8 text-violet-200 max-w-xl mx-auto">
          The modern school management system for seamless administration, collaboration, and growth. Secure, efficient, and beautifully simple.
        </p>
        <button
          className="mt-2 px-8 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow-lg transition-colors duration-200 text-lg"
          onClick={() => navigate("/role-selection")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
