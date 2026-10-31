import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { validateMediaFile, MediaValidationResult } from '../lib/utils';

export interface UploadOptions {
  bucket: 'avatars' | 'posts' | 'stories';
  folder?: string;
  onProgress?: (progress: number) => void;
}

export const storageService = {
  async uploadMedia(
    file: File,
    options: UploadOptions
  ): Promise<{ url: string; mediaType: 'image' | 'video' }> {
    // 1. Client-side validation
    const validation: MediaValidationResult = validateMediaFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file format or size limit exceeded');
    }

    const mediaType = validation.mediaType || 'image';

    // If Supabase is not configured, simulate upload with local ObjectURL
    if (!isSupabaseConfigured) {
      if (options.onProgress) {
        options.onProgress(50);
        await new Promise((r) => setTimeout(r, 200));
        options.onProgress(100);
      }
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl, mediaType };
    }

    // 2. Real Supabase Storage upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${options.folder || 'public'}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(options.bucket).getPublicUrl(data.path);

    if (options.onProgress) options.onProgress(100);
    return { url: publicUrl, mediaType };
  },
};
