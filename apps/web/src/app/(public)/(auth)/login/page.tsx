'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@smashd/validation';
import { Flame, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import ApiClient from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await ApiClient.login(data);
      setAuth(res.user, res.accessToken);
      if (res.user.role === 'admin' || res.user.role === 'manager') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setValue('email', 'admin@smashd.com');
      setValue('password', 'SmashdAdmin@2026');
    } else {
      setValue('email', 'customer@gmail.com');
      setValue('password', 'Customer@2026');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-dark-surface border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-brand-cream mx-auto shadow-brand-glow">
            <Flame className="w-7 h-7 fill-current" />
          </div>
          <h1 className="font-display font-black text-3xl text-brand-cream uppercase tracking-tight">
            SIGN IN
          </h1>
          <p className="text-xs text-brand-cream/60 font-body">
            Access your orders, saved addresses, and secret perks.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-brand-red/10 border border-brand-red text-brand-red text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {/* Demo Fast Fill Buttons */}
        <div className="p-4 rounded-2xl bg-brand-dark border border-white/5 space-y-2">
          <span className="text-[10px] font-mono uppercase text-brand-cream/50 block font-bold">
            QUICK EVALUATION ACCOUNTS:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-[11px] font-mono font-bold hover:bg-brand-yellow/20 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 border border-white/20 text-brand-cream text-[11px] font-mono font-bold hover:bg-white/20 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="e.g. admin@smashd.com"
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
            />
            {errors.email && <p className="text-xs text-brand-red font-mono mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
            />
            {errors.password && <p className="text-xs text-brand-red font-mono mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-black text-sm uppercase tracking-wider shadow-brand-glow transition-all active:scale-98"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs font-body text-brand-cream/60">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-yellow hover:underline font-bold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
