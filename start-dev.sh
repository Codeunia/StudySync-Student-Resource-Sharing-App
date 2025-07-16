#!/bin/bash

echo "🚀 Starting StudySync Application"
echo ""
echo "📋 Checking JSON Server status..."

# Check if JSON server is running on port 3001
if curl -s http://localhost:3001/posts > /dev/null 2>&1; then
    echo "✅ JSON Server is running on port 3001"
    echo "🔗 API available at: http://localhost:3001"
    echo "📊 Data will be persisted"
else
    echo "⚠️  JSON Server is not running"
    echo "📝 App will run with demo data (not persisted)"
    echo ""
    echo "💡 To enable data persistence, run in another terminal:"
    echo "   npm run json-server"
fi

echo ""
echo "🌐 Starting Vite development server..."
npm run dev
