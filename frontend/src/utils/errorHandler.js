// Universal error handling utilities

export const getErrorMessage = (error) => {
  // Network errors
  if (!navigator.onLine) {
    return 'Internet connection nahi hai. Connection check kariye.';
  }
  
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return 'Request timeout ho gaya. Internet connection slow hai.';
  }
  
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
    return 'Network error aa raha hai. Internet connection check kariye.';
  }
  
  // HTTP status errors
  if (error?.response?.status) {
    const status = error.response.status;
    const message = error.response.data?.message;
    
    switch (status) {
      case 400:
        return message || 'Bad request - Data mein koi issue hai.';
      case 401:
        return 'Authentication required - Login kariye.';
      case 403:
        return 'Access denied - Aapko permission nahi hai.';
      case 404:
        return 'Data nahi mila. Ho sakta hai yeh delete ho gaya ho.';
      case 422:
        return message || 'Validation error - Data format galat hai.';
      case 429:
        return 'Too many requests - Kuch der baad try kariye.';
      case 500:
        return 'Server error aa raha hai. Kuch der baad try kariye.';
      case 502:
        return 'Server temporarily unavailable hai.';
      case 503:
        return 'Service unavailable - Server maintenance ho raha hai.';
      default:
        return message || `HTTP Error ${status} - Server issue aa raha hai.`;
    }
  }
  
  // JavaScript errors
  if (error?.name === 'TypeError') {
    return 'Data processing mein error aa gaya hai.';
  }
  
  if (error?.name === 'ReferenceError') {
    return 'Application code mein issue hai.';
  }
  
  if (error?.name === 'SyntaxError') {
    return 'Data format galat hai.';
  }
  
  // Default error messages
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Koi unknown error aa gaya hai. Please try again.';
};

export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorDetails = {
    timestamp,
    context,
    error: {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
      status: error?.response?.status,
      url: error?.config?.url,
      method: error?.config?.method,
    },
    userAgent: navigator?.userAgent,
    url: window?.location?.href,
    online: navigator?.onLine
  };
  
  console.error('Application Error:', errorDetails);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTrackingService(errorDetails);
  }
  
  return errorDetails;
};

export const createRetryFunction = (originalFunction, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await originalFunction(...args);
      } catch (error) {
        lastError = error;
        logError(error, `Retry attempt ${attempt}/${maxRetries}`);
        
        // Don't retry on certain errors
        if (error?.response?.status === 401 || 
            error?.response?.status === 403 || 
            error?.response?.status === 404) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  };
};

export const validateProductId = (id) => {
  if (!id) {
    return { valid: false, error: 'Product ID missing hai.' };
  }
  
  if (typeof id !== 'string') {
    return { valid: false, error: 'Product ID format galat hai.' };
  }
  
  // Basic MongoDB ObjectId validation
  if (id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return { valid: false, error: 'Invalid Product ID format.' };
  }
  
  return { valid: true };
};

export const isOnline = () => {
  return navigator?.onLine !== false;
};

export const handleApiError = (error, context = '') => {
  logError(error, context);
  return getErrorMessage(error);
};
