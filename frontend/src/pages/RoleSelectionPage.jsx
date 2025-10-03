import React from "react";
import { useNavigate } from "react-router-dom";
import LightRays from '../components/ui/LightRays';

const roles = [
  {
    name: "Admin",
    description:
      "Full access to manage users, classes, schedules, and school settings.",
  },
  {
    name: "Teacher",
    description:
      "Manage classes, assignments, grades, and communicate with students.",
  },
  {
    name: "Student",
    description:
      "Access classes, assignments, grades, and communicate with teachers.",
  },
];

const RoleSelectionPage = () => {
  const navigate=useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black text-white font-poppins px-4">
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-violet-300 text-center">Select Your Role</h2>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
          {roles.map((role) => (
            <div
              key={role.name}
              className="bg-violet-900/70 border border-violet-700 rounded-2xl shadow-xl flex flex-col items-center p-8 w-full md:w-80 mb-4 md:mb-0"
            >
              <h3 className="text-2xl font-semibold mb-2 text-violet-400">{role.name}</h3>
              <p className="text-violet-200 mb-8 text-center">{role.description}</p>
              <button
                className="mt-auto px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200 text-base w-full"
                onClick={() => {
                  if (role.name === "Admin") navigate("/admin-signin");
                  else if (role.name === "Teacher") navigate("/teacher-signin");
                  else if (role.name === "Student") navigate("/student-signin");
                }}
              >
                Sign In
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;