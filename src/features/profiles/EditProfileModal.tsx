import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Shield, Globe, User, AtSign } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Profile } from '../../types';
import { editProfileSchema, EditProfileFormData } from '../auth/schemas';
import { storageService } from '../../services/storageService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { validateMediaFile } from '../../lib/utils';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdated: (updated: Profile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: profile.username,
      full_name: profile.full_name,
      bio: profile.bio || '',
      website: profile.website || '',
      is_private: profile.is_private,
    },
  });

  const isPrivate = watch('is_private');

  const handleAvatarSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validation = validateMediaFile(file);
    if (!validation.valid || validation.mediaType !== 'image') {
      toast('Please select a valid image (JPEG, PNG, WebP) under 10MB', 'error');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: EditProfileFormData) => {
    if (!user) return;
    try {
      setSubmitting(true);
      let newAvatarUrl = profile.avatar_url;

      if (avatarFile) {
        const uploadRes = await storageService.uploadMedia(avatarFile, {
          bucket: 'avatars',
          folder: user.id,
        });
        newAvatarUrl = uploadRes.url;
      }

      const updated = await updateProfile({
        username: data.username.toLowerCase(),
        full_name: data.full_name,
        bio: data.bio || '',
        website: data.website || null,
        is_private: data.is_private,
        avatar_url: newAvatarUrl,
      });

      toast('Profile updated successfully', 'success');
      onProfileUpdated(updated);
      onClose();
    } catch (err: any) {
      toast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="Edit Profile">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Avatar change section */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
          <div className="relative">
            <Avatar src={avatarPreview} alt={profile.username} size="lg" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-teal-600 text-white shadow-md hover:bg-teal-500 transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleAvatarSelect(e.target.files)}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-900 dark:text-white">
              {profile.username}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline text-left mt-0.5"
            >
              Change profile photo
            </button>
          </div>
        </div>

        {/* Inputs */}
        <Input
          label="Username"
          leftIcon={<AtSign className="w-4 h-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Full Name"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <Textarea
          label="Bio"
          rows={3}
          placeholder="Write something about yourself..."
          error={errors.bio?.message}
          {...register('bio')}
        />

        <Input
          label="Website"
          type="url"
          placeholder="https://yourwebsite.com"
          leftIcon={<Globe className="w-4 h-4" />}
          error={errors.website?.message}
          {...register('website')}
        />

        {/* Privacy toggle */}
        <label className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 cursor-pointer select-none">
          <input
            type="checkbox"
            className="rounded border-neutral-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
            {...register('is_private')}
          />
          <div className="flex-1 text-left">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Private Account
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isPrivate
                ? 'Only followers you approve can see your posts and stories.'
                : 'Anyone can see your posts, follower lists, and stories.'}
            </p>
          </div>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={submitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
