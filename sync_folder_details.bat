@echo off
title Sync 34 Folders Details from Excel
chcp 65001 >nul
cd /d "%~dp0"

echo ======================================================================
echo    SHABDVID - SYNC 34 FOLDERS SUMMARY FROM EXCEL INTO WEBSITE
echo ======================================================================
echo.
echo Reading fieldwork_folders_summary_template.xlsx and updating index.html...
echo.

python import_folders_from_excel.py

echo.
echo ======================================================================
echo Update complete! You can refresh your browser to see the changes.
echo ======================================================================
echo.
pause
