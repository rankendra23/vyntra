import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { forgotPasswordSchema, ForgotPasswordFormData } from './schemas';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { KeyRound, Mail } from 'lucide-react';

export const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      await authService.resetPassword(data.email);
      setIsSubmitted(true);
      toast('Reset link sent to your email', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="sm" title="Reset Password">
      {isSubmitted ? (
        <div className="flex flex-col items-center text-center p-2">
          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">
            Check your inbox
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            We've sent password reset instructions to your email address.
          </p>
          <Button variant="secondary" className="w-full" onClick={handleClose}>
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center text-center mb-2">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            Send Reset Link
          </Button>
        </form>
      )}
    </Modal>
  );
};
