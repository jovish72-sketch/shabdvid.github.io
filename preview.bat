@echo off
title Shabdvid Website Preview Server
echo ===================================================
echo     SHABDVID - LOCAL PREVIEW SERVER
echo ===================================================
echo.

netstat -ano | findstr :8080 | findstr LISTENING >nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Preview Server is already running on port 8080!
    echo Opening your browser now...
    start http://localhost:8080/index.html
) else (
    echo [STARTING] Starting server at http://localhost:8080 ...
    echo Opening your browser now...
    start http://localhost:8080/index.html
    python -m http.server 8080
)

echo.
echo ===================================================
echo Website opened at http://localhost:8080/index.html
echo ===================================================
pause
