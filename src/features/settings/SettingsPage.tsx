import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Moon,
  Sun,
  UserX,
  LogOut,
  Database,
  ExternalLink,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useTheme } from '../../hooks/useTheme';

export const SettingsPage: React.FC = () => {
  const { user, profile, updateProfile, signOut, isSupabaseLive } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isPrivate, setIsPrivate] = useState(profile?.is_private ?? false);
  const [updatingPrivacy, setUpdatingPrivacy] = useState(false);

  const handleTogglePrivacy = async () => {
    try {
      setUpdatingPrivacy(true);
      const newStatus = !isPrivate;
      setIsPrivate(newStatus);
      await updateProfile({ is_private: newStatus });
      toast(
        newStatus
          ? 'Account is now private. Only approved followers can view your posts.'
          : 'Account is now public. Anyone on SocialSphere can view your posts.',
        'success'
      );
    } catch {
      setIsPrivate(!isPrivate);
      toast('Failed to update privacy', 'error');
    } finally {
      setUpdatingPrivacy(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          Settings
        </h1>
        <p className="text-xs text-neutral-500">
          Manage your account preferences, privacy, and display options
        </p>
      </div>

      {/* Account Privacy Card */}
      <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Account Privacy
            </h2>
            <p className="text-xs text-neutral-500">
              Control who can see your photos, videos, and stories
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1 pr-4">
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Private Account
            </span>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              When your account is private, only people you approve can see your photos and videos. Your existing followers won't be affected.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={handleTogglePrivacy}
              disabled={updatingPrivacy}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
      </div>

      {/* Appearance Card */}
      <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-neutral-600" />}
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Appearance
            </h2>
            <p className="text-xs text-neutral-500">
              Switch between Light and Dark interface modes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Dark Mode
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleTheme}
            className="text-xs font-semibold"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>
      </div>

      {/* Backend & Deployment Architecture Info Card */}
      <div className="bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Backend & Services
            </h2>
            <p className="text-xs text-neutral-500">
              PostgreSQL, Supabase Auth, Storage & Realtime
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/40">
            <span className="font-medium">Connection Status</span>
            <span
              className={`inline-flex items-center gap-1.5 font-bold ${
                isSupabaseLive ? 'text-emerald-500' : 'text-teal-600 dark:text-teal-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {isSupabaseLive ? 'Live Supabase Connected' : 'SocialSphere Preview Mode'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/40">
            <span className="font-medium">Database Migrations</span>
            <span className="text-neutral-400 font-mono text-[11px]">
              supabase/migrations/
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800/40">
            <span className="font-medium">Storage Buckets</span>
            <span className="text-neutral-400 font-mono text-[11px]">
              avatars, posts, stories
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="font-medium">RLS Policies</span>
            <span className="text-emerald-500 font-bold">Enforced (18 Tables)</span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-2">
        <Button
          variant="danger"
          className="w-full gap-2"
          onClick={() => {
            signOut();
            toast('Logged out successfully', 'info');
            navigate('/login');
          }}
        >
          <LogOut className="w-4 h-4" />
          Log Out of SocialSphere
        </Button>
      </div>
    </div>
  );
};
