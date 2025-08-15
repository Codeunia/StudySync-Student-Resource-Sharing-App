// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiRequest = async (url, options = {}) => {
  try {
    // Get user token from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add authorization header if token exists
    if (user.token) {
      headers.Authorization = `Bearer ${user.token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      credentials: 'include',
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      
      // If unauthorized, clear stored user data
      if (response.status === 401) {
        localStorage.removeItem('user');
        // Optionally redirect to login
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
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
    return fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then(res => {
      if (!res.ok) {
        throw new Error('File upload failed');
      }
      return res.json();
    });
  }
};