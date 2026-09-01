'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@smashd/validation';
import { Flame, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import ApiClient from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await ApiClient.register(data);
      setAuth(res.user, res.accessToken);
      router.push('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-dark-surface border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red flex items-center justify-center text-brand-cream mx-auto shadow-brand-glow">
            <Flame className="w-7 h-7 fill-current" />
          </div>
          <h1 className="font-display font-black text-3xl text-brand-cream uppercase tracking-tight">
            JOIN THE SMASH CLUB
          </h1>
          <p className="text-xs text-brand-cream/60 font-body">
            Get 20% off your first order with code <strong>FIRSTBITE20</strong>
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-brand-red/10 border border-brand-red text-brand-red text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Rohan Sharma"
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
            />
            {errors.name && <p className="text-xs text-brand-red font-mono mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="e.g. rohan@gmail.com"
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
            />
            {errors.email && <p className="text-xs text-brand-red font-mono mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
              Mobile Number (10 digits)
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="e.g. 9812345678"
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
            />
            {errors.phone && <p className="text-xs text-brand-red font-mono mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
              Password (min 6 characters)
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
            <span>{isLoading ? 'CREATING PROFILE...' : 'REGISTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs font-body text-brand-cream/60">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-yellow hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
