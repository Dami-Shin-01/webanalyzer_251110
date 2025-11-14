/**
 * URL Validator Unit Tests
 * Tests URL validation logic for the frontend
 * Requirements: 1.5, 9.4
 */

import { validateURL } from '../urlValidator';

describe('URLValidator', () => {
  describe('Empty URL validation', () => {
    test('should reject empty string', () => {
      const result = validateURL('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('URL을 입력해주세요');
    });

    test('should reject whitespace-only string', () => {
      const result = validateURL('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('URL을 입력해주세요');
    });

    test('should reject null', () => {
      const result = validateURL(null);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('URL을 입력해주세요');
    });

    test('should reject undefined', () => {
      const result = validateURL(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('URL을 입력해주세요');
    });
  });

  describe('Protocol validation', () => {
    test('should accept valid HTTP URL', () => {
      const result = validateURL('http://example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept valid HTTPS URL', () => {
      const result = validateURL('https://example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject FTP protocol', () => {
      const result = validateURL('ftp://example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP 또는 HTTPS 프로토콜');
    });

    test('should reject file protocol', () => {
      const result = validateURL('file:///path/to/file');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP 또는 HTTPS 프로토콜');
    });

    test('should reject javascript protocol', () => {
      const result = validateURL('javascript:alert(1)');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP 또는 HTTPS 프로토콜');
    });

    test('should reject URL without protocol', () => {
      const result = validateURL('example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP 또는 HTTPS 프로토콜');
    });
  });

  describe('URL format validation', () => {
    test('should accept URL with path', () => {
      const result = validateURL('https://example.com/path/to/page');
      expect(result.valid).toBe(true);
    });

    test('should accept URL with query parameters', () => {
      const result = validateURL('https://example.com?param=value');
      expect(result.valid).toBe(true);
    });

    test('should accept URL with hash', () => {
      const result = validateURL('https://example.com#section');
      expect(result.valid).toBe(true);
    });

    test('should accept URL with port', () => {
      const result = validateURL('https://example.com:8080');
      expect(result.valid).toBe(true);
    });

    test('should accept URL with subdomain', () => {
      const result = validateURL('https://www.example.com');
      expect(result.valid).toBe(true);
    });

    test('should reject malformed URL', () => {
      const result = validateURL('https://');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('올바른 URL 형식이 아닙니다');
    });

    test('should reject URL with spaces', () => {
      const result = validateURL('https://example .com');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('올바른 URL 형식이 아닙니다');
    });
  });

  describe('Whitespace handling', () => {
    test('should trim leading whitespace', () => {
      const result = validateURL('  https://example.com');
      expect(result.valid).toBe(true);
    });

    test('should trim trailing whitespace', () => {
      const result = validateURL('https://example.com  ');
      expect(result.valid).toBe(true);
    });

    test('should trim both leading and trailing whitespace', () => {
      const result = validateURL('  https://example.com  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('Real-world URLs', () => {
    test('should accept common website URLs', () => {
      const urls = [
        'https://www.google.com',
        'https://github.com',
        'https://stackoverflow.com',
        'https://www.npmjs.com/package/react',
        'https://developer.mozilla.org/en-US/docs/Web'
      ];

      urls.forEach(url => {
        const result = validateURL(url);
        expect(result.valid).toBe(true);
      });
    });

    test('should accept URLs with complex paths', () => {
      const result = validateURL('https://example.com/path/to/resource?query=value&other=123#section');
      expect(result.valid).toBe(true);
    });
  });
});
