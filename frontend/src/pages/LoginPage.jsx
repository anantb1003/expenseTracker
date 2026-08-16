import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';
import DeveloperFooter from '../components/common/DeveloperFooter';

import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-slate-950 px-4 py-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Animated Gradient Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/25 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Spacer for vertical centering */}
      <div className="w-full flex-1 flex items-center justify-center relative z-10 my-4">
        {/* Login Card Container */}
        <div className="w-full max-w-md glass-container-dark p-8 sm:p-10 border border-white/20 animate-scale-in">
          
          {/* Animated Brand Badge */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/40 animate-float border border-white/30">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200 font-heading">
              Sign In to ExpenseFlow
            </h1>
            <p className="text-xs text-slate-300 font-semibold mt-1.5">Manage your daily expenses, budgets & analytics</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2 animate-slide-up backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Option */}
          <div className="mb-6">
            <GoogleAuthButton mode="signin" onSuccess={() => navigate('/')} onError={(err) => setError(err.message || 'Google Auth Failed')} />
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-700/80 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-black text-slate-300 uppercase tracking-widest absolute rounded-full border border-slate-700">
              Or Sign In with Email
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors z-10" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anantb1003@gmail.com"
                  className="glass-input-dark pl-11 pr-4"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black text-slate-200 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 absolute left-3.5 top-4 transition-colors z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input-dark pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-slate-400 hover:text-white transition z-10"
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
              className="w-full mt-2 py-3.5 rounded-2xl glass-btn-primary font-black text-sm tracking-wide shadow-xl shadow-indigo-600/40 active:scale-95 transition-all duration-200 border border-white/30"
            >
              Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Register Redirect */}
          <div className="text-center text-xs text-slate-300 font-semibold mt-8 pt-6 border-t border-slate-700/80">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-extrabold text-indigo-400 hover:text-indigo-300 transition underline underline-offset-4">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Highlights & Developer Footer */}
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-slate-400 bg-slate-900/80 backdrop-blur-md px-6 py-2 rounded-full border border-slate-800 shadow-xl max-w-xl mx-auto">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Zap className="w-3.5 h-3.5" /> Instant UPI Logs
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <TrendingUp className="w-3.5 h-3.5" /> Rupee Analytics
          </span>
        </div>

        <DeveloperFooter />
      </div>
    </div>
  );
};

export default LoginPage;
