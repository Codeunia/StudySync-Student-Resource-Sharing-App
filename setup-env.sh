#!/bin/bash
# setup-env.sh - Helper script to set up environment variables

echo "🚀 StudySync Deployment Setup Helper"
echo "======================================"
echo ""

echo "📝 Backend Environment Variables (for Render):"
echo "NODE_ENV=production"
echo "MONGO_URI=<your_mongodb_atlas_connection_string>"
echo "SESSION_SECRET=<generate_a_random_secret>"
echo "GOOGLE_CLIENT_ID=<your_google_oauth_client_id>"
echo "GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>"
echo "CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>"
echo "CLOUDINARY_API_KEY=<your_cloudinary_api_key>"
echo "CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>"
echo "FRONTEND_URL=<your_vercel_app_url>"
echo ""

echo "🌐 Frontend Environment Variables (for Vercel):"
echo "VITE_API_URL=<your_render_backend_url>"
echo ""

echo "🔧 Next steps:"
echo "1. Set up MongoDB Atlas database"
echo "2. Set up Cloudinary account"
echo "3. Set up Google OAuth credentials"
echo "4. Deploy backend to Render with above environment variables"
echo "5. Deploy frontend to Vercel with above environment variables"
echo "6. Update Google OAuth redirect URIs with production URLs"
echo ""

echo "📖 See DEPLOYMENT.md for detailed instructions!"
