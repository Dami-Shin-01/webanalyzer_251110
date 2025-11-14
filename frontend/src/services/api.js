import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Debug logging
console.log('🔧 API Service initialized with URL:', API_URL);

/**
 * Parse error response from backend
 * @param {Object} errorData - Error data from backend
 * @returns {Object} Parsed error object
 */
const parseErrorResponse = (errorData) => {
  if (errorData && typeof errorData === 'object') {
    return {
      type: errorData.type || 'unknown',
      message: errorData.message || '서버에서 오류가 발생했습니다.',
      details: errorData.details,
      recoverable: errorData.recoverable !== false,
      timestamp: errorData.timestamp
    };
  }
  return {
    type: 'unknown',
    message: '서버에서 오류가 발생했습니다.',
    recoverable: false
  };
};

/**
 * Analyze a website URL and extract design tokens
 * @param {string} url - The website URL to analyze
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeWebsite = async (url, options = {}) => {
  try {
    console.log('📡 Sending request to:', `${API_URL}/api/analyze`);
    console.log('📦 Request payload:', { url, options });
    
    const response = await axios.post(
      `${API_URL}/api/analyze`,
      {
        url,
        options: {
          includeDynamic: options.includeDynamic || false,
          timeout: options.timeout || 30000
        }
      },
      {
        timeout: options.timeout || 35000, // Slightly longer than backend timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Response received:', response.status);

    return response.data;
  } catch (error) {
    console.error('❌ Request failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.status,
      request: !!error.request
    });
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error('Server error response:', error.response.data);
      const errorData = error.response.data?.error;
      throw parseErrorResponse(errorData);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server');
      throw {
        type: 'network',
        message: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.',
        recoverable: true
      };
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      console.error('Request timeout');
      throw {
        type: 'timeout',
        message: '요청 시간이 초과되었습니다. 서버가 응답하지 않습니다.',
        recoverable: true
      };
    } else {
      // Something else happened
      console.error('Unknown error occurred');
      throw {
        type: 'unknown',
        message: error.message || '예상치 못한 오류가 발생했습니다.',
        recoverable: false
      };
    }
  }
};

/**
 * Check backend health status
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'network',
        message: '백엔드 서버에 연결할 수 없습니다.',
        recoverable: true
      }
    };
  }
};
