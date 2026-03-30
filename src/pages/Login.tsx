import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { Mail, Lock, Eye, EyeOff, Stethoscope } from 'lucide-react';
import { APP_LOGIN_TITLE, APP_LOGIN_SUBTITLE } from '@/config/appConfig';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // DEMO MODE: any email + any password logs in
    const userEmail = email || 'demo@company.com';
    dispatch(
      login({
        email: userEmail,
        user: {
          name: 'Demo User',
          role: 'Frontend Lead',
          email: userEmail,
          team: 'Frontend Team',
        },
      })
    );

    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-emerald-900/20" />

      {/* Moving light blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl animate-blob2" />
        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl animate-blob3" />
      </div>

      {/* Floating Login Panel */}
      <div className="relative z-10 w-full max-w-[400px] px-4 animate-fade-in animate-float">
        <div className="relative rounded-3xl bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
          {/* Glow outline effect */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 opacity-50 blur-xl -z-10" />

          <div className="px-8 py-10 sm:px-10 sm:py-12">
            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                <Stethoscope size={28} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {APP_LOGIN_TITLE}
              </h1>
              <p className="text-sm text-gray-400 text-center">
                {APP_LOGIN_SUBTITLE}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field - Underline Style */}
              <div className="space-y-2">
                <div className="floating-group relative">
                  <Mail
                    size={18}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                    }}
                    className="floating-input w-full bg-transparent border-0 border-b-2 border-gray-700 px-7 pt-4 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:shadow-[0_1px_0_0_rgba(59,130,246,0.5)] transition-all"
                    placeholder=" "
                  />
                  <label className="floating-label pointer-events-none absolute left-7 top-4 text-sm text-gray-400 transition-all duration-200">
                    Email address
                  </label>
                </div>
              </div>

              {/* Password Field - Underline Style */}
              <div className="space-y-2">
                <div className="floating-group relative">
                  <Lock
                    size={18}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                    }}
                    className="floating-input w-full bg-transparent border-0 border-b-2 border-gray-700 px-7 pr-10 pt-4 pb-2 text-sm text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:shadow-[0_1px_0_0_rgba(59,130,246,0.5)] transition-all"
                    placeholder=" "
                  />
                  <label className="floating-label pointer-events-none absolute left-7 top-4 text-sm text-gray-400 transition-all duration-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                        rememberMe ? 'bg-blue-500' : 'bg-gray-700'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                          rememberMe ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
              </div>

              {/* Login Button - Pill Shape with Glow */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting && (
                  <span className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
                )}
                <span>{isSubmitting ? 'Signing in…' : 'Sign in'}</span>
              </button>

              {/* Demo Helper Text */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Demo Mode — Enter any email and password
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
