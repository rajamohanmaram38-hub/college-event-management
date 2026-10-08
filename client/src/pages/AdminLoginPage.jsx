import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter admin credentials.');
      return;
    }

    const res = loginAdmin(email, password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@college.edu');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-900 text-indigo-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Faculty & Admin Portal
          </h2>
          <p className="text-xs text-slate-500">
            Sign in with authorized administrative privileges to create and manage events.
          </p>
        </div>

        {/* Demo Helper Banner */}
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs flex items-center justify-between shadow-sm">
          <div>
            <span className="font-bold block text-indigo-300">Default Admin Credentials:</span>
            <span className="text-[11px] text-slate-300">admin@college.edu / admin123</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-lg hover:bg-indigo-500 transition"
          >
            Auto Fill
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@college.edu"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Enter Admin Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center text-xs">
          <p className="text-slate-500">
            Are you a student?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Student Login Portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
