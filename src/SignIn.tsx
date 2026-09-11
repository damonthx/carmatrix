import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Mail, Lock, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SignIn({ 
  onBack, 
  onSignUp, 
  onSuccess,
  initialEmail = '',
  signupSuccess = false
}: { 
  onBack: () => void; 
  onSignUp: () => void; 
  onSuccess: () => void;
  initialEmail?: string;
  signupSuccess?: boolean;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial email when it changes
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        {signupSuccess && (
          <div className="mb-6 flex items-start gap-4 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
            <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-500" size={20} />
            <div className="text-sm font-semibold leading-relaxed">
              Your account has been created. Please check your email and verify your address before logging in.
            </div>
          </div>
        )}

        <div className="light-glass-card rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <img 
              src="https://res.cloudinary.com/yrhldsmj/image/upload/v1789086556/Logo-CarMatrix_avzdkk.png" 
              alt="CarMatrix Logo" 
              className="h-[60px] mx-auto mb-6 object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Log in to your CarMatrix account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055c8] text-white py-3.5 rounded-xl font-bold hover:bg-[#003b8e] transition-colors shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <button 
                onClick={onSignUp}
                className="text-[#0055c8] font-bold hover:underline underline-offset-2"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
