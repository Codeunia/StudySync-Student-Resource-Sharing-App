# JSON Server Setup for StudySync

## Overview

The application now uses JSON Server to persist data for posts and resources. This means your posts and resources will be saved and won't disappear when you reload the page.

## Quick Start

### Option 1: Run Everything at Once

```bash
npm run dev:full
```

This will start both the JSON server (port 3001) and the Vite dev server (port 5173) simultaneously.

### Option 2: Run Separately

Open two terminal windows/tabs:

**Terminal 1 - JSON Server:**

```bash
npm run json-server
```

**Terminal 2 - Vite Dev Server:**

```bash
npm run dev
```

## API Endpoints

The JSON Server runs on `http://localhost:3001` and provides the following endpoints:

### Posts

- `GET /posts` - Get all posts
- `GET /posts?author.username=username` - Get posts by user
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `PATCH /posts/:id` - Partial update (e.g., likes)

### Resources

- `GET /resources` - Get all resources
- `GET /resources?author.username=username` - Get resources by user
- `POST /resources` - Create new resource
- `PUT /resources/:id` - Update resource
- `DELETE /resources/:id` - Delete resource

### Users

- `GET /users` - Get all users
- `GET /users?username=username` - Get user by username
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `PATCH /users/:id` - Partial update

## Data Structure

### Post Object

```json
{
	"id": 1,
	"content": "Post content with automatic link detection",
	"link": {
		"title": "Optional link title",
		"url": "https://example.com"
	},
	"timestamp": "2025-07-14T10:00:00Z",
	"likes": 0,
	"comments": 0,
	"author": {
		"name": "User Name",
		"username": "username",
		"avatar": null
	}
}
```

### Resource Object

```json
{
	"id": 1,
	"title": "Resource Title",
	"type": "PDF|Image|Video|Link|File",
	"url": "https://example.com/resource",
	"description": "How this resource helped me",
	"timestamp": "2025-07-14T10:00:00Z",
	"resourceFile": null,
	"author": {
		"name": "User Name",
		"username": "username",
		"avatar": null
	}
}
```

### User Object

```json
{
	"id": 1,
	"fullName": "User Name",
	"username": "username",
	"role": "Student|Working Professional",
	"institution": "Institution Name",
	"graduatingYear": "2027",
	"skills": ["JavaScript", "React"],
	"followers": ["user1", "user2"],
	"photo": null
}
```

## Features

### Data Persistence

- ✅ Posts and resources are saved to JSON file
- ✅ Data persists across page reloads
- ✅ Real-time updates when creating new content

### Error Handling

- ✅ Server status checking
- ✅ Graceful error messages
- ✅ Retry functionality
- ✅ Loading states

### API Integration

- ✅ RESTful API calls
- ✅ Optimistic UI updates
- ✅ Proper error handling
- ✅ Automatic link detection in saved content

## File Structure

```
data/
  db.json              # Main database file
src/
  utils/
    api.js             # API utility functions
  pages/
    Profile.jsx        # Updated to use API calls
```

## Troubleshooting

### JSON Server Not Starting

If you get port conflicts, you can change the port in `package.json`:

```json
"json-server": "json-server --watch data/db.json --port 3002"
```

### Data Not Loading

1. Make sure JSON server is running on port 3001
2. Check browser console for error messages
3. Verify `data/db.json` exists and has valid JSON
4. Try the "Retry" button in the error message

### CORS Issues

JSON Server handles CORS automatically for local development. If you encounter issues, make sure you're accessing the app through `localhost` and not `127.0.0.1`.

## Development Notes

### Adding New Endpoints

To add new data types, simply add them to `data/db.json`:

```json
{
  "posts": [...],
  "resources": [...],
  "users": [...],
  "newDataType": [...]
}
```

### API Functions

All API functions are in `src/utils/api.js`. They handle:

- HTTP requests with proper headers
- Error handling and logging
- Response parsing
- Server status checking

## Production Deployment

For production, you'll want to replace JSON Server with a proper backend like:

- Node.js with Express + MongoDB
- Supabase
- Firebase
- Any REST API backend

The API utility functions are designed to make this transition easy - just update the `API_BASE_URL` and ensure your backend follows the same endpoint patterns.
