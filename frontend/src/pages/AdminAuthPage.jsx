import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const AdminAuthPage = () => {
  const API_URL=import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const url = isSignUp
        ? `${API_URL}/admin/signup`
        : `${API_URL}/admin/signin`;
      const res = await axios.post(url, { email, password });
      const data = res.data;
      if (data.message?.toLowerCase().includes("error") || data.message?.toLowerCase().includes("invalid")) {
        setError(data.message || "Something went wrong");
      } else {
        setSuccess(data.message);
        if (data.token) {
          localStorage.setItem("nexus_admin_jwt", data.token);
          setTimeout(() => navigate("/admin/dashboard"), 1000);
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  const responseGoogle = async (authresult) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      if (!authresult.code) {
        setError("Google login failed: No code received");
        setLoading(false);
        return;
      }
      const res = await axios.post(`${API_URL}/admin/google-oauth`, { code: authresult.code });
      const data = res.data;
      if (data.token) {
        localStorage.setItem("nexus_admin_jwt", data.token);
        setSuccess("Google sign in successful!");
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else {
        setError(data.message || "Google sign in failed");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Google OAuth error");
    } finally {
      setLoading(false);
    }
  }

  const googleLogin=useGoogleLogin(
    {
      onSuccess:responseGoogle,
      onError:responseGoogle,
      flow:"auth-code",
    }
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-950 via-violet-900 to-violet-800 text-white font-poppins px-4">
      <div className="bg-violet-900/80 border border-violet-700 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-violet-300 text-center">
          {isSignUp ? "Admin Sign Up" : "Admin Sign In"}
        </h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-lg px-4 py-2 bg-violet-950 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-violet-400"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-lg px-4 py-2 bg-violet-950 border border-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-violet-400 w-full pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-200 focus:outline-none"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c2.03 0 3.92.62 5.475 1.675m2.122 2.122A9.956 9.956 0 0121 12c0 1.306-.835 3.417-2.474 5.126M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0c0 3-4 7-9 7s-9-4-9-7 4-7 9-7 9 4 9 7z" /></svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="rounded-lg px-4 py-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold shadow transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (isSignUp ? "Signing Up..." : "Signing In...") : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
          {error && <div className="text-red-400 text-center mt-2">{error}</div>}
          {success && <div className="text-green-400 text-center mt-2">{success}</div>}
        </form>
        <div className="w-full flex flex-col items-center mt-4">
          <button
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-white text-violet-700 font-semibold shadow hover:bg-violet-50 transition-colors duration-200 w-full"
            type="button" onClick={googleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.5 24.5C47.5 23.1 47.4 21.7 47.2 20.4H24V28.1H37.2C36.7 30.7 35.1 32.9 32.7 34.4V39.1H40.2C44.1 35.5 47.5 30.5 47.5 24.5Z" fill="#4285F4"/><path d="M24 48C30.5 48 35.9 45.9 40.2 39.1L32.7 34.4C30.7 35.7 28.3 36.6 24 36.6C18.7 36.6 14.2 32.9 12.7 28.1H5V33C9.3 41.2 16.2 48 24 48Z" fill="#34A853"/><path d="M12.7 28.1C12.3 26.8 12.1 25.4 12.1 24C12.1 22.6 12.3 21.2 12.7 19.9V15H5C3.2 18.4 2 21.9 2 24C2 26.1 3.2 29.6 5 33L12.7 28.1Z" fill="#FBBC05"/><path d="M24 11.4C27.1 11.4 29.5 12.5 31.2 13.9L39.4 6.2C35.9 2.9 30.5 0 24 0C16.2 0 9.3 6.8 5 15L12.7 19.9C14.2 15.1 18.7 11.4 24 11.4Z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>
            Sign in with Google
          </button>
        </div>
        <div className="mt-6 text-center">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                className="text-violet-400 hover:underline focus:outline-none"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New here?{' '}
              <button
                className="text-violet-400 hover:underline focus:outline-none"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
