import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, User, Mail, Lock, Shield, AtSign } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { registerSchema, RegisterFormData } from './schemas';
import { useAuth } from './AuthContext';
import { useToast } from '../../hooks/useToast';

export const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      is_private: false,
    },
  });

  const isPrivate = watch('is_private');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await signUp({
        email: data.email,
        password: data.password,
        username: data.username.toLowerCase(),
        full_name: data.full_name,
        is_private: data.is_private,
      });
      toast('Account created successfully! Welcome to Vyntra.', 'success');
      navigate('/');
    } catch (err: any) {
      toast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-neutral-50 dark:bg-[#08080a]">
      <div className="w-full max-w-[420px] flex flex-col gap-6 my-8">
        <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl shadow-black/5 flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 mb-4 animate-scale-in">
              <Sparkles className="w-7 h-7 fill-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Join Vyntra
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Sign up to share moments, photos, and connect with creators
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <Input
              label="Username"
              type="text"
              placeholder="unique_username"
              leftIcon={<AtSign className="w-4 h-4" />}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.full_name?.message}
              {...register('full_name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="jane@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Account Privacy Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-neutral-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                  {...register('is_private')}
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Private Account
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {isPrivate
                      ? 'Only followers you approve will see your photos & videos.'
                      : 'Anyone on Vyntra can see your profile and posts.'}
                  </p>
                </div>
              </label>
            </div>

            <Button type="submit" className="w-full mt-4" isLoading={loading}>
              Create Account
            </Button>
          </form>
        </div>

        {/* Bottom Switch Card */}
        <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
