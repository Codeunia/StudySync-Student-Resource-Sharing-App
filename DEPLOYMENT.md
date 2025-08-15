# StudySync Deployment Guide

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas account (for database)
- Cloudinary account (for file uploads)
- Google OAuth credentials

## 1. Deploy Backend to Render

### Step 1: Create a MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/studysync`)

### Step 2: Set up Cloudinary
1. Go to [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard

### Step 3: Set up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your Render URL to authorized redirect URIs: `https://your-app-name.onrender.com/auth/google/callback`

### Step 4: Deploy to Render
1. Go to [Render](https://render.com/)
2. Connect your GitHub account
3. Click "New" → "Web Service"
4. Select your repository
5. Configure the service:
   - **Name**: `studysync-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier is fine for testing

6. Add Environment Variables in Render dashboard:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   SESSION_SECRET=your_random_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

7. Click "Create Web Service"

## 2. Deploy Frontend to Vercel

### Step 1: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Connect your GitHub account
3. Import your repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `StudySync-Student-Resource-Sharing-App` (or leave empty if deploying from root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variables in Vercel
In your Vercel project dashboard → Settings → Environment Variables, add:
```
VITE_API_URL=https://your-render-app-name.onrender.com
```

### Step 3: Update Google OAuth
1. Go back to Google Cloud Console
2. Add your Vercel domain to authorized origins: `https://your-vercel-app.vercel.app`

## 3. Final Steps

1. **Update CORS**: Once you have your Vercel URL, update the `FRONTEND_URL` environment variable in Render
2. **Test the deployment**: Visit your Vercel app and test all functionality
3. **Monitor logs**: Check Render logs if you encounter any issues

## Common Issues and Solutions

### Issue: CORS errors
- Make sure `FRONTEND_URL` is set correctly in Render
- Ensure Google OAuth redirect URIs include both development and production URLs

### Issue: Database connection fails
- Verify MongoDB Atlas connection string
- Make sure to whitelist Render's IP addresses in MongoDB Atlas (or use 0.0.0.0/0 for all IPs)

### Issue: Environment variables not working
- Make sure environment variables are set in both Render and Vercel dashboards
- For Vite, environment variables must start with `VITE_`

### Issue: Build fails
- Check that all dependencies are listed in package.json
- Verify build commands are correct
- Check build logs for specific error messages

## URLs to Keep Handy
- Backend API: `https://your-render-app.onrender.com`
- Frontend App: `https://your-vercel-app.vercel.app`
- MongoDB Atlas: Connection string from your cluster
- Google OAuth: Redirect URIs in Cloud Console
