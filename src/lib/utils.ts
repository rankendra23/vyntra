import { formatDistanceToNowStrict } from 'date-fns';

export function cn(...inputs: (string | number | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatTimeAgo(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const distance = formatDistanceToNowStrict(date, { addSuffix: false });
    
    // Shorten format like Instagram (e.g., "5m", "2h", "4d", "2w")
    return distance
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo')
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');
  } catch {
    return 'just now';
  }
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  if (!matches) return [];
  // return lowercase without '#' and deduplicated
  return Array.from(new Set(matches.map((tag) => tag.slice(1).toLowerCase())));
}

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: 'image' | 'video';
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export function validateMediaFile(file: File): MediaValidationResult {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type || 'unknown'}). Supported formats: JPEG, PNG, WebP, MP4, WebM.`,
    };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image size exceeds the maximum limit of 10MB. (File is ${(file.size / (1024 * 1024)).toFixed(1)}MB)`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Video size exceeds the maximum limit of 50MB. (File is ${(file.size / (1024 * 1024)).toFixed(1)}MB)`,
    };
  }

  return {
    valid: true,
    mediaType: isImage ? 'image' : 'video',
  };
}
