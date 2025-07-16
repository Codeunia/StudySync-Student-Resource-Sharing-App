// API utility functions for interacting with JSON Server
const API_BASE_URL = 'http://localhost:3001';

// Generic API functions
const apiRequest = async (url, options = {}) => {
	try {
		const response = await fetch(`${API_BASE_URL}${url}`, {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// Check if response is actually JSON
		const contentType = response.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			const text = await response.text();
			console.error(
				'Non-JSON response received:',
				text.substring(0, 200)
			);
			throw new Error(
				'Server returned non-JSON response. JSON Server may not be running properly.'
			);
		}

		return await response.json();
	} catch (error) {
		console.error('API request failed:', error);
		throw error;
	}
};

// Posts API functions
export const postsAPI = {
	// Get all posts
	getAll: () => apiRequest('/posts?_sort=timestamp&_order=desc'),

	// Get posts by user (client-side filtering since JSON Server doesn't support nested properties)
	getByUser: async username => {
		const allPosts = await apiRequest('/posts?_sort=timestamp&_order=desc');
		return allPosts.filter(post => post.author?.username === username);
	},

	// Create new post
	create: post =>
		apiRequest('/posts', {
			method: 'POST',
			body: JSON.stringify(post),
		}),

	// Update post
	update: (id, post) =>
		apiRequest(`/posts/${id}`, {
			method: 'PUT',
			body: JSON.stringify(post),
		}),

	// Delete post
	delete: id =>
		apiRequest(`/posts/${id}`, {
			method: 'DELETE',
		}),

	// Like/Unlike post
	like: async id => {
		const post = await apiRequest(`/posts/${id}`);
		return apiRequest(`/posts/${id}`, {
			method: 'PATCH',
			body: JSON.stringify({ likes: post.likes + 1 }),
		});
	},
};

// Resources API functions
export const resourcesAPI = {
	// Get all resources
	getAll: () => apiRequest('/resources?_sort=timestamp&_order=desc'),

	// Get resources by user (client-side filtering)
	getByUser: async username => {
		const allResources = await apiRequest(
			'/resources?_sort=timestamp&_order=desc'
		);
		return allResources.filter(
			resource => resource.author?.username === username
		);
	},

	// Create new resource
	create: resource =>
		apiRequest('/resources', {
			method: 'POST',
			body: JSON.stringify(resource),
		}),

	// Update resource
	update: (id, resource) =>
		apiRequest(`/resources/${id}`, {
			method: 'PUT',
			body: JSON.stringify(resource),
		}),

	// Delete resource
	delete: id =>
		apiRequest(`/resources/${id}`, {
			method: 'DELETE',
		}),
};

// Users API functions
export const usersAPI = {
	// Get all users
	getAll: () => apiRequest('/users'),

	// Get user by username (client-side filtering)
	getByUsername: async username => {
		const allUsers = await apiRequest('/users');
		return allUsers.filter(user => user.username === username);
	},

	// Create new user
	create: user =>
		apiRequest('/users', {
			method: 'POST',
			body: JSON.stringify(user),
		}),

	// Update user
	update: (id, user) =>
		apiRequest(`/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(user),
		}),

	// Update user profile
	updateProfile: async (username, updates) => {
		const allUsers = await apiRequest('/users');
		const users = allUsers.filter(user => user.username === username);
		if (users.length > 0) {
			const user = users[0];
			return apiRequest(`/users/${user.id}`, {
				method: 'PATCH',
				body: JSON.stringify(updates),
			});
		}
		throw new Error('User not found');
	},
};

// Function to enrich posts/resources with user data
export const enrichWithUserData = async (items, users = null) => {
	// Fetch users if not provided
	if (!users) {
		users = await usersAPI.getAll();
	}

const enrichedItems = items.map(item => {
        // If item already has complete author information, return as is
        if (item.author && item.author.avatar) {
            return item;
        }

        // Otherwise, try to enrich with user data
        const user = users.find(
            u => u.username === (item.authorUsername || item.author?.username)
        );
        return {
            ...item,
            author: {
                name: user
                    ? user.fullName
                    : item.author?.name || 'Unknown User',
                username:
                    item.authorUsername || item.author?.username || 'unknown',
                avatar: user
                    ? user.avatar || user.photo
                    : item.author?.avatar || null,
            },
        };
    });
    
    // Sort and return with newest first
    return enrichedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};
// Helper function to check if JSON Server is running
export const checkServerStatus = async () => {
	try {
		const response = await fetch(`${API_BASE_URL}/posts`);
		if (!response.ok) {
			console.warn('JSON Server responded with error:', response.status);
			return false;
		}

		// Try to parse as JSON to make sure it's actually JSON Server
		const data = await response.json();
		console.log('JSON Server is running and returned valid JSON');
		return true;
	} catch (error) {
		console.warn('JSON Server check failed:', error.message);
		return false;
	}
};

export default {
	postsAPI,
	resourcesAPI,
	usersAPI,
	checkServerStatus,
};
