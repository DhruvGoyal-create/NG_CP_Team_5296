@echo off
echo 🚀 Starting Smart Spend Financial Management System...
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if needed
echo 📦 Checking dependencies...
pip install -r requirements.txt >nul 2>&1

REM Start backend server
echo 🔧 Starting Django backend server...
cd backend
start "Django Backend" cmd /k "python manage.py runserver 0.0.0.0:8000"

REM Start frontend server
echo 🌐 Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "python -m http.server 3000"

echo.
echo ✅ Both servers started!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000
echo 👤 Admin Panel: http://localhost:8000/admin
echo.
echo 📝 Press any key to stop all servers...
pause >nul

REM Stop servers
echo 🛑 Stopping servers...
taskkill /f /im python.exe >nul 2>&1
echo ✅ Servers stopped.
pause
