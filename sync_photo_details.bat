@echo off
title Sync Photo Details from Excel
chcp 65001 >nul
cd /d "%~dp0"

echo ======================================================================
echo    SHABDVID - SYNC PHOTO DETAILS FROM EXCEL INTO WEBSITE
echo ======================================================================
echo.
echo Reading fieldwork_photos_details_template.xlsx and updating index.html...
echo.

python import_details_from_excel.py

echo.
echo ======================================================================
echo Update complete! You can refresh your browser to see the changes.
echo ======================================================================
echo.
pause
