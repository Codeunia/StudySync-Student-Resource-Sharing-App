// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    const user = JSON.parse(userStr);
    if (!user || !user.token) return false;
    
    // Check if token is still valid (not expired)
    const tokenData = JSON.parse(Buffer.from(user.token, 'base64').toString());
    const tokenAge = Date.now() - tokenData.timestamp;
    return tokenAge < 24 * 60 * 60 * 1000; // 24 hours
  } catch (error) {
    console.log('Error checking authentication:', error);
    return false;
  }
};

// Helper function to clear expired auth data
const clearExpiredAuth = () => {
  localStorage.removeItem('user');
  console.log('Cleared expired authentication data');
};

const apiRequest = async (url, options = {}) => {
  try {
    // Get user token from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('User from localStorage:', user); // Debug log
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add authorization header if token exists and is valid
    if (user && user.token) {
      // Validate token isn't expired (check if older than 24 hours)
      try {
        const tokenData = JSON.parse(Buffer.from(user.token, 'base64').toString());
        const tokenAge = Date.now() - tokenData.timestamp;
        const isTokenValid = tokenAge < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isTokenValid) {
          headers.Authorization = `Bearer ${user.token}`;
          console.log('Added Authorization header with valid token'); // Debug log
        } else {
          console.log('Token expired, clearing localStorage'); // Debug log
          localStorage.removeItem('user');
          // Redirect to login if token is expired
          window.location.href = '/';
          return;
        }
      } catch (tokenError) {
        console.log('Invalid token format, clearing localStorage'); // Debug log
        localStorage.removeItem('user');
        window.location.href = '/';
        return;
      }
    } else {
      console.log('No valid token found in localStorage'); // Debug log
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      credentials: 'include',
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      
      // If unauthorized, clear stored user data but don't redirect immediately
      if (response.status === 401) {
        console.log('401 Unauthorized - clearing localStorage');
        localStorage.removeItem('user');
        // Don't redirect automatically - let the component handle it
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // --- THIS IS THE FIX ---
    // If the response is "204 No Content", it was successful but there's no JSON to parse.
    // In this case, we can just return null.
    if (response.status === 204) {
      return null;
    }
    // Otherwise, parse the JSON as normal.
    return await response.json();
    // --- END OF FIX ---

  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
};

// All the API objects below remain the same.
export const authAPI = {
  getCurrentUser: () => apiRequest('/auth/user'),
};

export const postsAPI = {
  getAll: () => apiRequest('/api/posts'),
  getMyPosts: () => apiRequest('/api/posts/me'),
  create: postData => apiRequest('/api/posts', { method: 'POST', body: JSON.stringify(postData) }),
  delete: id => apiRequest(`/api/posts/${id}`, { method: 'DELETE' }),
  like: id => apiRequest(`/api/posts/${id}/like`, { method: 'PATCH' }),
  addComment: (id, commentData) => apiRequest(`/api/posts/${id}/comments`, { method: 'POST', body: JSON.stringify(commentData) }),
};

export const resourcesAPI = {
  getAll: (page = 1) => apiRequest(`/api/resources?page=${page}&limit=5`),
  getMyResources: () => apiRequest('/api/resources/me'),
  create: resourceData => apiRequest('/api/resources', { method: 'POST', body: JSON.stringify(resourceData) }),
  delete: id => apiRequest(`/api/resources/${id}`, { method: 'DELETE' }),
};

export const uploadAPI = {
  uploadFile: (formData) => {
    // Get user token from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('Upload API - User from localStorage:', user); // Debug log
    
    const headers = {};
    
    // Add authorization header if token exists and is valid
    if (user && user.token) {
      try {
        const tokenData = JSON.parse(Buffer.from(user.token, 'base64').toString());
        const tokenAge = Date.now() - tokenData.timestamp;
        const isTokenValid = tokenAge < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isTokenValid) {
          headers.Authorization = `Bearer ${user.token}`;
          console.log('Upload API - Added Authorization header with valid token'); // Debug log
        } else {
          console.log('Upload API - Token expired, clearing localStorage'); // Debug log
          localStorage.removeItem('user');
          window.location.href = '/';
          return Promise.reject(new Error('Token expired'));
        }
      } catch (tokenError) {
        console.log('Upload API - Invalid token format, clearing localStorage'); // Debug log
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(new Error('Invalid token'));
      }
    } else {
      console.log('Upload API - No valid token found in localStorage'); // Debug log
      return Promise.reject(new Error('No authentication token'));
    }
    
    return fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
    }).then(res => {
      if (!res.ok) {
        throw new Error('File upload failed');
      }
      return res.json();
    });
  }
};

// Export helper functions
export { isAuthenticated, clearExpiredAuth };