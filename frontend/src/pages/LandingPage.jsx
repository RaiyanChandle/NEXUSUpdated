import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-950 via-violet-900 to-violet-800 text-white font-poppins">
      <div className="text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-violet-400 drop-shadow-lg">NEXUS</h1>
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
