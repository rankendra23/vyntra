import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  editProfileSchema,
} from '../features/auth/schemas';

describe('Authentication & Profile Validation Schemas', () => {
  describe('loginSchema', () => {
    it('passes with valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'alex@socialsphere.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('fails with invalid email format', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email');
      }
    });

    it('fails when password is too short', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const result = registerSchema.safeParse({
        username: 'elena_creative',
        full_name: 'Elena Rostova',
        email: 'elena@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        is_private: false,
      });
      expect(result.success).toBe(true);
    });

    it('rejects passwords that do not match', () => {
      const result = registerSchema.safeParse({
        username: 'elena_creative',
        full_name: 'Elena Rostova',
        email: 'elena@example.com',
        password: 'password123',
        confirmPassword: 'differentPassword',
        is_private: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
      }
    });

    it('enforces valid username characters (letters, numbers, underscore, period)', () => {
      const invalidCharsResult = registerSchema.safeParse({
        username: 'invalid user!@#',
        full_name: 'Invalid User',
        email: 'user@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        is_private: false,
      });
      expect(invalidCharsResult.success).toBe(false);

      const tooShortResult = registerSchema.safeParse({
        username: 'ab',
        full_name: 'AB',
        email: 'user@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        is_private: false,
      });
      expect(tooShortResult.success).toBe(false);
    });
  });

  describe('editProfileSchema', () => {
    it('validates bio length constraints and url format', () => {
      const valid = editProfileSchema.safeParse({
        username: 'designer_pro',
        full_name: 'Pro Designer',
        bio: 'Creating modern interfaces.',
        website: 'https://design.com',
        is_private: true,
      });
      expect(valid.success).toBe(true);

      const invalidUrl = editProfileSchema.safeParse({
        username: 'designer_pro',
        full_name: 'Pro Designer',
        bio: 'Creating modern interfaces.',
        website: 'not-a-valid-url',
        is_private: false,
      });
      expect(invalidUrl.success).toBe(false);
    });
  });
});
