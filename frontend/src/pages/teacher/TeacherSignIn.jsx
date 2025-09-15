import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherSignIn = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/teacher/signin`, { email, password });
      const data = res.data;
      if (data.token) {
        localStorage.setItem("nexus_teacher_jwt", data.token);
        navigate("/teacher/dashboard");
      } else {
        setError(data.message || "Sign in failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Network error or invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-950 via-violet-900 to-violet-800 text-white font-poppins px-4">
      <div className="bg-violet-900/80 border border-violet-700 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-violet-300 text-center">Teacher Sign In</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-lg px-4 py-2 bg-violet-950 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-violet-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="rounded-lg px-4 py-2 bg-violet-950 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-violet-400"
            required
          />
          <button
            type="submit"
            className="rounded-lg px-4 py-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default TeacherSignIn;
