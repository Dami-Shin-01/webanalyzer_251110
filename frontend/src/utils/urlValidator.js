/**
 * Validate URL format and protocol
 * @param {string} url - The URL to validate
 * @returns {Object} Validation result with valid flag and error message
 */
export const validateURL = (url) => {
  // Check if URL is empty
  if (!url || !url.trim()) {
    return { 
      valid: false, 
      error: 'URL을 입력해주세요.' 
    };
  }

  const trimmedUrl = url.trim();

  // Check if URL starts with http:// or https://
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return { 
      valid: false, 
      error: 'HTTP 또는 HTTPS 프로토콜로 시작하는 URL을 입력해주세요.' 
    };
  }

  // Validate URL format
  try {
    new URL(trimmedUrl);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: '올바른 URL 형식이 아닙니다.' 
    };
  }
};
