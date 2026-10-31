import React, { useState, useRef } from 'react';
import { Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { storageService } from '../../services/storageService';
import { storyService } from '../../services/storyService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { validateMediaFile } from '../../lib/utils';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated?: () => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onStoryCreated,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSelectFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    const validation = validateMediaFile(selected);
    if (!validation.valid) {
      toast(validation.error || 'Invalid file format', 'error');
      return;
    }

    setFile(selected);
    setMediaType(validation.mediaType || 'image');
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setCaption('');
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    try {
      setLoading(true);
      const res = await storageService.uploadMedia(file, {
        bucket: 'stories',
        folder: user.id,
      });

      await storyService.createStory({
        authorId: user.id,
        mediaUrl: res.url,
        mediaType: res.mediaType,
        caption: caption.trim() || undefined,
      });

      toast('Story added! It will expire in 24 hours.', 'success');
      handleClose();
      if (onStoryCreated) onStoryCreated();
    } catch (err: any) {
      toast(err.message || 'Failed to upload story', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="sm" title="Add to Story">
      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl cursor-pointer hover:border-teal-500 transition-colors text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleSelectFile(e.target.files)}
            accept="image/jpeg,image/png,image/webp,video/mp4"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
            Select story media
          </h4>
          <p className="text-xs text-neutral-400">Photos or short videos</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative aspect-[9/16] max-h-[350px] w-full bg-black rounded-2xl overflow-hidden mx-auto">
            {mediaType === 'video' ? (
              <video src={previewUrl} controls className="w-full h-full object-cover" />
            ) : (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setFile(null);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Input
            placeholder="Add text to your story (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={loading}>
              Share Story
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
