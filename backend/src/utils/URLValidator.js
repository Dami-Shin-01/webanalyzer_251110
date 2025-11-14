/**
 * URLValidator - Validates and sanitizes URLs for security
 * 
 * Requirements:
 * - 1.5: URL validation and error handling
 * - 9.4: Security measures (protocol validation, private IP blocking)
 */

class URLValidator {
  /**
   * Validates a URL for security and format
   * @param {string} url - The URL to validate
   * @returns {ValidationResult} - Validation result with valid flag and optional error
   */
  static validate(url) {
    // Check if URL is provided
    if (!url || typeof url !== 'string') {
      return {
        valid: false,
        error: 'URL이 필요합니다.',
        type: 'missing_url'
      };
    }

    // Trim whitespace
    url = url.trim();

    // Check for invalid characters first (before URL parsing)
    if (this.hasInvalidCharacters(url)) {
      return {
        valid: false,
        error: 'URL에 허용되지 않는 문자가 포함되어 있습니다.',
        type: 'invalid_characters'
      };
    }

    // Check URL format
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (error) {
      return {
        valid: false,
        error: '올바른 URL 형식이 아닙니다.',
        type: 'invalid_format',
        details: error.message
      };
    }

    // Protocol validation - only HTTP/HTTPS allowed
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'HTTP 또는 HTTPS 프로토콜만 지원됩니다.',
        type: 'invalid_protocol',
        protocol: urlObj.protocol
      };
    }

    // Block localhost and private IPs
    if (this.isPrivateOrLocalhost(urlObj.hostname)) {
      return {
        valid: false,
        error: '로컬 또는 사설 IP 주소는 분석할 수 없습니다.',
        type: 'private_ip',
        hostname: urlObj.hostname
      };
    }

    return {
      valid: true,
      url: urlObj.href,
      hostname: urlObj.hostname,
      protocol: urlObj.protocol
    };
  }

  /**
   * Checks if hostname is localhost or a private IP address
   * @param {string} hostname - The hostname to check
   * @returns {boolean} - True if private or localhost
   */
  static isPrivateOrLocalhost(hostname) {
    // Localhost checks
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname === '::1' ||
        hostname.endsWith('.localhost')) {
      return true;
    }

    // Check for private IPv4 ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    
    if (match) {
      const octets = match.slice(1).map(Number);
      
      // Validate octets are in valid range
      if (octets.some(octet => octet < 0 || octet > 255)) {
        return true; // Invalid IP, treat as private
      }

      const [first, second] = octets;

      // Private IPv4 ranges:
      // 10.0.0.0 - 10.255.255.255
      if (first === 10) {
        return true;
      }

      // 172.16.0.0 - 172.31.255.255
      if (first === 172 && second >= 16 && second <= 31) {
        return true;
      }

      // 192.168.0.0 - 192.168.255.255
      if (first === 192 && second === 168) {
        return true;
      }

      // 169.254.0.0 - 169.254.255.255 (link-local)
      if (first === 169 && second === 254) {
        return true;
      }

      // 0.0.0.0 - 0.255.255.255
      if (first === 0) {
        return true;
      }
    }

    // Check for private IPv6 ranges
    // Note: URL() constructor keeps brackets in hostname for IPv6
    if (hostname.includes(':')) {
      // Remove brackets if present for easier matching
      const lowerHostname = hostname.toLowerCase().replace(/^\[|\]$/g, '');
      
      // Loopback (::1)
      if (lowerHostname === '::1' || lowerHostname === '0:0:0:0:0:0:0:1') {
        return true;
      }
      
      // Link-local addresses (fe80::/10)
      if (lowerHostname.startsWith('fe80:') || lowerHostname.startsWith('fe80::')) {
        return true;
      }

      // Unique local addresses (fc00::/7)
      if (lowerHostname.startsWith('fc') || lowerHostname.startsWith('fd')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks for invalid or suspicious characters in URL
   * @param {string} url - The URL to check
   * @returns {boolean} - True if invalid characters found
   */
  static hasInvalidCharacters(url) {
    // Check for null bytes or control characters
    if (/[\x00-\x1F\x7F]/.test(url)) {
      return true;
    }

    // Check for suspicious patterns that might indicate injection attempts
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Sanitizes a URL by removing potentially dangerous components
   * @param {string} url - The URL to sanitize
   * @returns {string} - Sanitized URL
   */
  static sanitize(url) {
    if (!url) return '';
    
    // Remove leading/trailing whitespace
    url = url.trim();
    
    // Remove any null bytes
    url = url.replace(/\x00/g, '');
    
    return url;
  }
}

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the URL is valid
 * @property {string} [error] - Error message if invalid
 * @property {string} [type] - Error type
 * @property {string} [url] - Normalized URL if valid
 * @property {string} [hostname] - Hostname if valid
 * @property {string} [protocol] - Protocol if valid
 * @property {*} [details] - Additional error details
 */

module.exports = URLValidator;
