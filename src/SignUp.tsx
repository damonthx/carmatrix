import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function SignUp({ onBack, onSignIn, onSuccess }: { onBack: () => void; onSignIn: () => void; onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // Always call onSuccess with email, the parent handles if it needs to show a "confirm email" message
      onSuccess(email);
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

        <div className="light-glass-card rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <img 
              src="https://res.cloudinary.com/yrhldsmj/image/upload/v1789086556/Logo-CarMatrix_avzdkk.png" 
              alt="CarMeta Logo" 
              className="h-[60px] mx-auto mb-6 object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create account</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Join CarMeta for a better car buying experience</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
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
                  placeholder="Minimum 6 characters"
                  minLength={6}
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <button 
                onClick={onSignIn}
                className="text-[#0055c8] font-bold hover:underline underline-offset-2"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
