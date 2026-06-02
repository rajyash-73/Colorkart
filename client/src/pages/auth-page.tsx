import React, { useState } from "react";
import SEOHead from '@/components/SEOHead';
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, ChevronLeft, Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const { user, loginMutation, registerMutation, signInWithGoogle, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registered, setRegistered] = useState(false);
  const [resending, setResending] = useState(false);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (user) return <Redirect to="/" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tab === 'login') {
      loginMutation.mutate({ email, password }, {
        onError: (err) => {
          const msg = err.message;
          if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
            setError('Please confirm your email before signing in. Check your inbox for a confirmation link.');
          } else if (msg.includes('Invalid login credentials')) {
            setError('Incorrect email or password. Please try again.');
          } else {
            setError(msg);
          }
        }
      });
    } else {
      if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
      registerMutation.mutate({ email, password, name }, {
        onSuccess: () => {
          setRegistered(true);
        },
        onError: (err) => {
          const msg = err.message;
          if (msg.includes('User already registered')) {
            setError('An account with this email already exists. Try signing in instead.');
            setTab('login');
          } else {
            setError(msg);
          }
        }
      });
    }
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setResending(false);
    if (error) {
      setError('Failed to resend: ' + error.message);
    } else {
      setSuccess('Confirmation email resent! Check your inbox.');
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  // Email confirmation sent screen
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">We sent a confirmation link to</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-6">{email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Click the link in the email to confirm your account, then come back here to sign in.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => { setRegistered(false); setTab('login'); }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Sign In
            </button>
            <button
              onClick={handleResendConfirmation}
              disabled={resending}
              className="w-full py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {resending ? 'Resending...' : "Didn't receive it? Resend email"}
            </button>
            {success && <p className="text-green-600 text-sm">{success}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SEOHead
        title="Sign In or Create Account | Coolors"
        description="Sign in or create a free Coolors account to save unlimited color palettes, share with the community and export in multiple formats."
        canonicalPath="/auth"
        noIndex={true}
      />
      {/* Nav */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ChevronLeft size={16} />
            <span className="font-medium">Back to Coolors</span>
          </a>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Coolors</span>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-57px)] flex-col md:flex-row">
        {/* Hero */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-700 p-12 flex-col justify-center text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Your Colors, Your Story</h1>
            <p className="text-violet-200 text-lg mb-8">Create, save, and share beautiful color palettes. Join thousands of designers using Coolors.</p>
            <div className="space-y-3">
              {['Save unlimited palettes', 'Share with the community', 'Export in CSS, SCSS, Tailwind'].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-400 flex items-center justify-center text-xs">✓</div>
                  <span className="text-violet-100">{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-2">
              {['#6C5CE7','#A29BFE','#74B9FF','#55EFC4','#FD79A8'].map(c => (
                <div key={c} className="w-10 h-10 rounded-xl shadow-lg border-2 border-white/30" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{tab === 'login' ? 'Sign in to your Coolors account' : 'Start creating beautiful palettes'}</p>

              {/* Google OAuth */}
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              </div>

              {/* Tab toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-5">
                <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'login' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Sign In</button>
                <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'register' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Register</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'register' && (
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Resend confirmation if email not confirmed */}
                {error.includes('confirm your email') && email && (
                  <button type="button" onClick={handleResendConfirmation} disabled={resending}
                    className="w-full text-sm text-violet-600 hover:underline disabled:opacity-50"
                  >
                    {resending ? 'Resending...' : 'Resend confirmation email'}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <p className="text-xs text-center text-gray-400 mt-4">
                By continuing, you agree to our{' '}
                <a href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
