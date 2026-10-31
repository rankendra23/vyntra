import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Lock, Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { loginSchema, LoginFormData } from './schemas';
import { useAuth } from './AuthContext';
import { useToast } from '../../hooks/useToast';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, isSupabaseLive } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
      toast('Welcome back to SocialSphere!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setValue('email', 'elena@socialsphere.com');
    setValue('password', 'password123');
    try {
      setLoading(true);
      await signIn('elena@socialsphere.com', 'password123');
      toast('Signed in as demo creator Elena Rostova!', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast(err.message || 'Demo sign in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-neutral-50 dark:bg-[#08080a]">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        {/* Main Card */}
        <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl shadow-black/5 flex flex-col">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 mb-4 animate-scale-in">
              <Sparkles className="w-7 h-7 fill-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              SocialSphere
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Connect, share moments, and explore inspiration
            </p>

            {/* Supabase status badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-teal-500'
                }`}
              />
              {isSupabaseLive ? 'Live Supabase Connected' : 'SocialSphere Preview Mode'}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                >
                  Forgot?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={loading}>
              Sign In
            </Button>

            {/* Demo Quick Button */}
            {!isSupabaseLive && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleQuickDemo}
                disabled={loading}
              >
                Quick Demo Sign-In
              </Button>
            )}
          </form>
        </div>

        {/* Bottom Switch Card */}
        <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
