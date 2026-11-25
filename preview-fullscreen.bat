@echo off
title Shabdvid Fullscreen Preview
echo Starting Shabdvid in Google Chrome Fullscreen...

:: Launch Chrome in Fullscreen directly to the local server
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --start-fullscreen "http://localhost:8080/index.html"
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --start-fullscreen "http://localhost:8080/index.html"
) else (
    start "" chrome --start-fullscreen "http://localhost:8080/index.html"
)

exit
