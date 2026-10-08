import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function StudentLoginPage() {
  const { loginStudent, loginWithGoogle, authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = await loginStudent(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    const res = await loginWithGoogle();
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDemoFill = () => {
    setEmail('alex.chen@student.apex.edu');
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Login
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your registered events and download gate passes.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google One-Click Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={authLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-3 hover:border-slate-400 hover:shadow disabled:opacity-60"
        >
          {authLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{authLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            or sign in with email
          </span>
          <div className="border-t border-slate-200 w-full"></div>
        </div>

        {/* Demo Helper Banner */}
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-center justify-between">
          <div>
            <span className="font-bold block">Quick Demo Account:</span>
            <span className="text-[11px] text-indigo-700">alex.chen@student.apex.edu</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-lg hover:bg-indigo-700 transition"
          >
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Student University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.name@student.apex.edu"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Sign In with Email</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center space-y-2 text-xs">
          <p className="text-slate-500">
            Don't have a student account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-slate-400 text-[11px]">
            Are you a faculty organizer or admin?{' '}
            <Link to="/admin/login" className="font-semibold text-slate-700 hover:underline">
              Admin Login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
