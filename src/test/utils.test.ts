import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  extractHashtags,
  validateMediaFile,
  formatTimeAgo,
  cn,
} from '../lib/utils';

describe('Utility Functions', () => {
  describe('cn (classNames)', () => {
    it('combines truthy class names and filters falsy ones', () => {
      expect(cn('class-a', false && 'class-b', 'class-c', null, undefined)).toBe('class-a class-c');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers less than 1,000 without suffix', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(450)).toBe('450');
      expect(formatNumber(999)).toBe('999');
    });

    it('formats thousands with K suffix', () => {
      expect(formatNumber(1000)).toBe('1K');
      expect(formatNumber(2500)).toBe('2.5K');
      expect(formatNumber(15400)).toBe('15.4K');
    });

    it('formats millions with M suffix', () => {
      expect(formatNumber(1000000)).toBe('1M');
      expect(formatNumber(2400000)).toBe('2.4M');
    });
  });

  describe('extractHashtags', () => {
    it('extracts unique hashtags from text in lowercase', () => {
      const text = 'Exploring #Tokyo and #Japan at night! #tokyo #Photography';
      const tags = extractHashtags(text);
      expect(tags).toEqual(['tokyo', 'japan', 'photography']);
    });

    it('returns empty array when no hashtags exist', () => {
      expect(extractHashtags('Hello world!')).toEqual([]);
    });
  });

  describe('validateMediaFile', () => {
    it('validates supported image formats', () => {
      const validImage = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
      const result = validateMediaFile(validImage);
      expect(result.valid).toBe(true);
      expect(result.mediaType).toBe('image');
    });

    it('validates supported video formats', () => {
      const validVideo = new File(['dummy content'], 'video.mp4', { type: 'video/mp4' });
      const result = validateMediaFile(validVideo);
      expect(result.valid).toBe(true);
      expect(result.mediaType).toBe('video');
    });

    it('rejects unsupported file formats', () => {
      const invalidFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
      const result = validateMediaFile(invalidFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file type');
    });

    it('rejects images exceeding 10MB limit', () => {
      const bigBuffer = new Uint8Array(11 * 1024 * 1024);
      const bigImage = new File([bigBuffer], 'giant.png', { type: 'image/png' });
      const result = validateMediaFile(bigImage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds the maximum limit');
    });
  });

  describe('formatTimeAgo', () => {
    it('formats recent date to relative shortened string', () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const formatted = formatTimeAgo(tenMinutesAgo);
      expect(formatted).toBe('10m');
    });
  });
});
