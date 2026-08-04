import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, User, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, ShieldCheck, Zap, TrendingUp, Code } from 'lucide-react';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({ name, email, password, currency: 'INR' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-slate-950 px-4 py-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Animated Gradient Background Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Spacer for vertical centering */}
      <div className="w-full flex-1 flex items-center justify-center relative z-10 my-4">
        {/* Register Card Container */}
        <div className="w-full max-w-md bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950/90 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_-12px_rgba(168,85,247,0.25)] animate-scale-in">
          
          {/* Animated Brand Badge */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30 animate-float">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-black text-purple-400 mb-2 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              Get Started Free
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white mt-1">Create Account</h1>
            <p className="text-xs text-slate-400 mt-1.5">Start tracking your daily expenses in Rupees today</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-slide-up">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 absolute left-3.5 top-3.5 transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anant Bawaskar"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 absolute left-3.5 top-3.5 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anantba1003@gmail.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 absolute left-3.5 top-3.5 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl text-sm bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm tracking-wide shadow-lg shadow-purple-600/30 active:scale-95 transition-all duration-200"
            >
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Login Redirect */}
          <div className="text-center text-xs text-slate-400 mt-8 pt-6 border-t border-slate-800/80">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-purple-400 hover:text-purple-300 transition underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Credit Footer */}
      <footer className="relative z-10 text-center pb-2">
        <div className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Designed & Developed by</span>
          <a
            href="mailto:anantb1003@gmail.com"
            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 hover:underline"
          >
            Anant Bawaskar
          </a>
          <span className="text-slate-500 font-mono text-[11px]">(anantb1003@gmail.com)</span>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
