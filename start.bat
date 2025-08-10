@echo off
echo Starting InsureTrack Application...
echo.

echo Starting Backend Server...
start "InsureTrack Server" cmd /k "cd server && npm run dev"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Client...
start "InsureTrack Client" cmd /k "cd client && npm start"

echo.
echo Both applications are starting...
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause > nul
