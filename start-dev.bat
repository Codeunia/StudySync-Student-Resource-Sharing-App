@echo off
cls
echo.
echo 🚀 Starting StudySync Application
echo.
echo 📋 Checking JSON Server status...

REM Check if JSON server is running on port 3001
netstat -an | findstr ":3001" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ JSON Server appears to be running on port 3001
    echo 🔗 API should be available at: http://localhost:3001
    echo 📊 Data will be persisted
) else (
    echo ⚠️  JSON Server is not running
    echo 📝 App will run with demo data ^(not persisted^)
    echo.
    echo 💡 To enable data persistence, run in another terminal:
    echo    npm run json-server
)

echo.
echo 🌐 Starting Vite development server...
echo.
npm run dev
