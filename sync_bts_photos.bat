@echo off
title Sync BTS Folder Photos into Website
chcp 65001 >nul
cd /d "%~dp0"

echo ======================================================================
echo       SHABDVID - AUTO-SYNC BTS PHOTOS INTO WEBSITE
echo ======================================================================
echo.
echo Scanning all subfolders inside bts-assets for new/updated photos...
echo.

python sync_bts_photos.py

echo.
echo ======================================================================
echo All photos are now synced into the website! Refresh your browser.
echo ======================================================================
echo.
pause
