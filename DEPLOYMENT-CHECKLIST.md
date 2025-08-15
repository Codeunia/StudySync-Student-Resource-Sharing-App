# 🚀 StudySync Deployment Checklist

## Pre-Deployment Setup
- [ ] Push all your code to GitHub
- [ ] Set up MongoDB Atlas database
- [ ] Set up Cloudinary account for file uploads
- [ ] Set up Google OAuth credentials

## Backend Deployment (Render)
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command to `npm install`
- [ ] Set start command to `npm start`
- [ ] Add all required environment variables:
  - [ ] NODE_ENV=production
  - [ ] MONGO_URI
  - [ ] SESSION_SECRET
  - [ ] GOOGLE_CLIENT_ID
  - [ ] GOOGLE_CLIENT_SECRET
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
  - [ ] FRONTEND_URL (will be your Vercel URL)
- [ ] Deploy and test backend

## Frontend Deployment (Vercel)
- [ ] Import repository to Vercel
- [ ] Set framework preset to Vite
- [ ] Set build command to `npm run build`
- [ ] Set output directory to `dist`
- [ ] Add environment variable: VITE_API_URL (your Render backend URL)
- [ ] Deploy and test frontend

## Post-Deployment
- [ ] Update Google OAuth redirect URIs with production URLs
- [ ] Update MongoDB Atlas IP whitelist if needed
- [ ] Test all features (login, file upload, CRUD operations)
- [ ] Monitor logs for any errors

## URLs to Save
- Backend (Render): https://your-app-name.onrender.com
- Frontend (Vercel): https://your-project-name.vercel.app
- Database: MongoDB Atlas connection string
