/**
 * URLValidator Tests
 * 
 * Tests for URL validation, security checks, and input sanitization
 * Requirements: 1.5, 9.4
 */

const URLValidator = require('../URLValidator');

describe('URLValidator', () => {
  describe('validate()', () => {
    describe('Valid URLs', () => {
      test('should accept valid HTTP URL', () => {
        const result = URLValidator.validate('http://example.com');
        expect(result.valid).toBe(true);
        expect(result.url).toBe('http://example.com/');
        expect(result.hostname).toBe('example.com');
        expect(result.protocol).toBe('http:');
      });

      test('should accept valid HTTPS URL', () => {
        const result = URLValidator.validate('https://example.com');
        expect(result.valid).toBe(true);
        expect(result.url).toBe('https://example.com/');
        expect(result.hostname).toBe('example.com');
        expect(result.protocol).toBe('https:');
      });

      test('should accept URL with path', () => {
        const result = URLValidator.validate('https://example.com/path/to/page');
        expect(result.valid).toBe(true);
        expect(result.url).toBe('https://example.com/path/to/page');
      });

      test('should accept URL with query parameters', () => {
        const result = URLValidator.validate('https://example.com?param=value');
        expect(result.valid).toBe(true);
      });

      test('should accept URL with port', () => {
        const result = URLValidator.validate('https://example.com:8080');
        expect(result.valid).toBe(true);
      });

      test('should trim whitespace from URL', () => {
        const result = URLValidator.validate('  https://example.com  ');
        expect(result.valid).toBe(true);
        expect(result.url).toBe('https://example.com/');
      });
    });

    describe('Invalid URL Format', () => {
      test('should reject missing URL', () => {
        const result = URLValidator.validate('');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('URL이 필요합니다');
        expect(result.type).toBe('missing_url');
      });

      test('should reject null URL', () => {
        const result = URLValidator.validate(null);
        expect(result.valid).toBe(false);
        expect(result.type).toBe('missing_url');
      });

      test('should reject undefined URL', () => {
        const result = URLValidator.validate(undefined);
        expect(result.valid).toBe(false);
        expect(result.type).toBe('missing_url');
      });

      test('should reject non-string URL', () => {
        const result = URLValidator.validate(12345);
        expect(result.valid).toBe(false);
        expect(result.type).toBe('missing_url');
      });

      test('should reject malformed URL', () => {
        const result = URLValidator.validate('not a url');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('올바른 URL 형식이 아닙니다');
        expect(result.type).toBe('invalid_format');
      });

      test('should reject URL without protocol', () => {
        const result = URLValidator.validate('example.com');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('invalid_format');
      });
    });

    describe('Protocol Validation', () => {
      test('should reject FTP protocol', () => {
        const result = URLValidator.validate('ftp://example.com');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('HTTP 또는 HTTPS 프로토콜만 지원됩니다');
        expect(result.type).toBe('invalid_protocol');
        expect(result.protocol).toBe('ftp:');
      });

      test('should reject file protocol', () => {
        const result = URLValidator.validate('file:///path/to/file');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('invalid_characters');
      });

      test('should reject javascript protocol', () => {
        const result = URLValidator.validate('javascript:alert(1)');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('invalid_characters');
      });

      test('should reject data protocol', () => {
        const result = URLValidator.validate('data:text/html,<script>alert(1)</script>');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('invalid_characters');
      });
    });

    describe('Private IP and Localhost Blocking', () => {
      test('should reject localhost', () => {
        const result = URLValidator.validate('http://localhost');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('로컬 또는 사설 IP');
        expect(result.type).toBe('private_ip');
      });

      test('should reject 127.0.0.1', () => {
        const result = URLValidator.validate('http://127.0.0.1');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject IPv6 localhost', () => {
        const result = URLValidator.validate('http://[::1]');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject .localhost domain', () => {
        const result = URLValidator.validate('http://test.localhost');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject 10.x.x.x private range', () => {
        const result = URLValidator.validate('http://10.0.0.1');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject 192.168.x.x private range', () => {
        const result = URLValidator.validate('http://192.168.1.1');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject 172.16-31.x.x private range', () => {
        const result = URLValidator.validate('http://172.16.0.1');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject 169.254.x.x link-local range', () => {
        const result = URLValidator.validate('http://169.254.1.1');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject 0.0.0.0', () => {
        const result = URLValidator.validate('http://0.0.0.0');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject IPv6 link-local (fe80::)', () => {
        const result = URLValidator.validate('http://[fe80::1]');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject IPv6 unique local (fc00::)', () => {
        const result = URLValidator.validate('http://[fc00::1]');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });

      test('should reject IPv6 unique local (fd00::)', () => {
        const result = URLValidator.validate('http://[fd00::1]');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('private_ip');
      });
    });

    describe('Invalid Characters', () => {
      test('should reject URL with null bytes', () => {
        const result = URLValidator.validate('http://example.com\x00');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('invalid_characters');
      });

      test('should reject URL with control characters', () => {
        const result = URLValidator.validate('http://example.com\x01');
        expect(result.valid).toBe(false);
        expect(result.type).toBe('invalid_characters');
      });
    });
  });

  describe('isPrivateOrLocalhost()', () => {
    test('should identify localhost', () => {
      expect(URLValidator.isPrivateOrLocalhost('localhost')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('127.0.0.1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('::1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('test.localhost')).toBe(true);
    });

    test('should identify private IPv4 ranges', () => {
      expect(URLValidator.isPrivateOrLocalhost('10.0.0.1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('10.255.255.255')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('192.168.0.1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('192.168.255.255')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('172.16.0.1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('172.31.255.255')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('169.254.1.1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('0.0.0.0')).toBe(true);
    });

    test('should not flag public IPv4 addresses', () => {
      expect(URLValidator.isPrivateOrLocalhost('8.8.8.8')).toBe(false);
      expect(URLValidator.isPrivateOrLocalhost('1.1.1.1')).toBe(false);
      expect(URLValidator.isPrivateOrLocalhost('172.15.0.1')).toBe(false);
      expect(URLValidator.isPrivateOrLocalhost('172.32.0.1')).toBe(false);
    });

    test('should identify private IPv6 ranges', () => {
      expect(URLValidator.isPrivateOrLocalhost('fe80::1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('fc00::1')).toBe(true);
      expect(URLValidator.isPrivateOrLocalhost('fd00::1')).toBe(true);
    });

    test('should not flag public hostnames', () => {
      expect(URLValidator.isPrivateOrLocalhost('example.com')).toBe(false);
      expect(URLValidator.isPrivateOrLocalhost('google.com')).toBe(false);
      expect(URLValidator.isPrivateOrLocalhost('github.com')).toBe(false);
    });
  });

  describe('hasInvalidCharacters()', () => {
    test('should detect null bytes', () => {
      expect(URLValidator.hasInvalidCharacters('http://example.com\x00')).toBe(true);
    });

    test('should detect control characters', () => {
      expect(URLValidator.hasInvalidCharacters('http://example.com\x01')).toBe(true);
      expect(URLValidator.hasInvalidCharacters('http://example.com\x1F')).toBe(true);
    });

    test('should detect javascript protocol', () => {
      expect(URLValidator.hasInvalidCharacters('javascript:alert(1)')).toBe(true);
    });

    test('should detect data protocol', () => {
      expect(URLValidator.hasInvalidCharacters('data:text/html')).toBe(true);
    });

    test('should detect vbscript protocol', () => {
      expect(URLValidator.hasInvalidCharacters('vbscript:msgbox(1)')).toBe(true);
    });

    test('should detect file protocol', () => {
      expect(URLValidator.hasInvalidCharacters('file:///etc/passwd')).toBe(true);
    });

    test('should not flag valid URLs', () => {
      expect(URLValidator.hasInvalidCharacters('http://example.com')).toBe(false);
      expect(URLValidator.hasInvalidCharacters('https://example.com/path?query=value')).toBe(false);
    });
  });

  describe('sanitize()', () => {
    test('should trim whitespace', () => {
      expect(URLValidator.sanitize('  http://example.com  ')).toBe('http://example.com');
    });

    test('should remove null bytes', () => {
      expect(URLValidator.sanitize('http://example.com\x00')).toBe('http://example.com');
    });

    test('should handle empty string', () => {
      expect(URLValidator.sanitize('')).toBe('');
    });

    test('should handle null', () => {
      expect(URLValidator.sanitize(null)).toBe('');
    });

    test('should handle undefined', () => {
      expect(URLValidator.sanitize(undefined)).toBe('');
    });

    test('should not modify valid URLs', () => {
      const url = 'https://example.com/path';
      expect(URLValidator.sanitize(url)).toBe(url);
    });
  });
});
