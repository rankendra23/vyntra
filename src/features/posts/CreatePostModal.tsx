import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Film,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { storageService } from '../../services/storageService';
import { postService } from '../../services/postService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../hooks/useToast';
import { validateMediaFile } from '../../lib/utils';

interface SelectedMediaFile {
  file: File;
  previewUrl: string;
  mediaType: 'image' | 'video';
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedMediaFile[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newSelected: SelectedMediaFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateMediaFile(file);
      if (!validation.valid) {
        toast(validation.error || 'Invalid file', 'error');
        continue;
      }
      newSelected.push({
        file,
        previewUrl: URL.createObjectURL(file),
        mediaType: validation.mediaType || 'image',
      });
    }

    if (newSelected.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newSelected]);
    }
  }, [toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
    if (currentSlide >= selectedFiles.length - 1 && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const resetForm = () => {
    selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setSelectedFiles([]);
    setCurrentSlide(0);
    setCaption('');
    setLocation('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (isUploading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please sign in to publish a post', 'error');
      return;
    }
    if (selectedFiles.length === 0) {
      toast('Please select at least one photo or video', 'error');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Upload each file
      const uploadedMedia: Array<{ url: string; mediaType: 'image' | 'video' }> = [];
      const total = selectedFiles.length;

      for (let i = 0; i < total; i++) {
        const item = selectedFiles[i];
        const res = await storageService.uploadMedia(item.file, {
          bucket: 'posts',
          folder: user.id,
          onProgress: (p) => {
            const stepWeight = 70 / total;
            setUploadProgress(10 + Math.round(i * stepWeight + (p / 100) * stepWeight));
          },
        });
        uploadedMedia.push(res);
      }

      setUploadProgress(85);

      // Save post in PostgreSQL / Service
      await postService.createPost({
        authorId: user.id,
        caption: caption.trim(),
        location: location.trim() || undefined,
        media: uploadedMedia,
      });

      setUploadProgress(100);
      toast('Post published successfully!', 'success');
      handleClose();
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      toast(err.message || 'Failed to create post', 'error');
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="3xl"
      title={selectedFiles.length > 0 ? 'Create new post' : 'Upload photos or videos'}
    >
      {selectedFiles.length === 0 ? (
        // Dropzone & File picker
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
            isDragOver
              ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 shadow-sm">
            <Upload className="w-8 h-8 animate-bounce" />
          </div>

          <h4 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
            Drag photos and videos here
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 text-center max-w-xs">
            Supports JPEG, PNG, WebP (up to 10MB) and MP4, WebM videos (up to 50MB).
          </p>

          <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
            Select from computer
          </Button>
        </div>
      ) : (
        // Form with media carousel preview and post details
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
          {/* Media Preview Carousel */}
          <div className="flex-1 flex flex-col">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center select-none shadow-inner">
              {selectedFiles[currentSlide].mediaType === 'video' ? (
                <video
                  src={selectedFiles[currentSlide].previewUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={selectedFiles[currentSlide].previewUrl}
                  alt={`Selected ${currentSlide + 1}`}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Prev / Next buttons */}
              {selectedFiles.length > 1 && (
                <>
                  {currentSlide > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => prev - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {currentSlide < selectedFiles.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => prev + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}

                  {/* Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    {selectedFiles.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentSlide ? 'w-4 bg-teal-400' : 'w-1.5 bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Remove current button */}
              <button
                type="button"
                onClick={() => handleRemoveFile(currentSlide)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors shadow"
                title="Remove this media"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail selector & Add More */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {selectedFiles.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                    idx === currentSlide
                      ? 'border-teal-500 ring-2 ring-teal-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.mediaType === 'video' ? (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white">
                      <Film className="w-5 h-5" />
                    </div>
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center text-neutral-400 hover:text-teal-500 hover:border-teal-500 transition-colors shrink-0"
                title="Add more photos or videos"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFiles(e.target.files)}
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                className="hidden"
              />
            </div>
          </div>

          {/* Details Form Side */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <Textarea
                label="Caption"
                placeholder="Write a caption... (e.g. #travel #minimalism)"
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              <Input
                label="Add Location"
                placeholder="e.g. Tokyo, Japan"
                leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Tip:{' '}
                </span>
                Include #hashtags in your caption to make your post discoverable on the Explore page.
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>Publishing post...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={isUploading}
                disabled={selectedFiles.length === 0}
              >
                Share
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
