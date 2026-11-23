@echo off
setlocal enabledelayedexpansion

set "PORTAL_DIR=%~dp0"
set "PREF_FILE=%PORTAL_DIR%.portal-pref"
set "MODE="

if /I "%~1"=="--reset" (
    if exist "%PREF_FILE%" del /f /q "%PREF_FILE%"
    echo Saved portal preference cleared.
)

if exist "%PREF_FILE%" (
    set /p MODE=<"%PREF_FILE%"
)

set "HAS_NODE=0"
where node >nul 2>nul
if not errorlevel 1 set "HAS_NODE=1"

set "HAS_PY=0"
where python >nul 2>nul
if not errorlevel 1 set "HAS_PY=1"

if defined MODE goto :dispatch

echo.
echo ============================================================
echo   Project Governance Portal - Local Launcher
echo ============================================================

if "%HAS_NODE%"=="1" goto :menu_node
if "%HAS_PY%"=="1" goto :menu_python
goto :menu_none

:menu_node
echo   Node.js detected on this machine.
echo   [1] Live Local Server via Node.js - Recommended, 127.0.0.1
echo   [2] Direct Browser Mode - No server, select folder in browser
set "CHOICE="
set /p CHOICE="Choose mode [1/2] (saved for future launches): "
if "%CHOICE%"=="2" (
    set "MODE=browser"
) else (
    set "MODE=node"
)
goto :save_pref

:menu_python
echo   Python detected on this machine.
echo   [1] Local Static Server via Python - 127.0.0.1
echo   [2] Direct Browser Mode - Zero install, select folder in browser
echo   [3] Open Node.js download page - Optional for live API mode
set "CHOICE="
set /p CHOICE="Choose mode [1/2/3]: "
if "%CHOICE%"=="3" goto :download_node
if "%CHOICE%"=="2" (
    set "MODE=browser"
) else (
    set "MODE=python"
)
goto :save_pref

:menu_none
echo   Node.js and Python were not detected on this machine.
echo   [1] Direct Browser Mode - Recommended, zero install
echo   [2] Open Node.js download page - Optional for live local server
set "CHOICE="
set /p CHOICE="Choose mode [1/2]: "
if "%CHOICE%"=="2" goto :download_node
set "MODE=browser"
goto :save_pref

:download_node
start "" "https://nodejs.org/"
echo Install Node.js then re-run start_portal.bat.
pause
exit /b 0

:save_pref
>"%PREF_FILE%" echo %MODE%
echo Saved preference: %MODE% (run "start_portal.bat --reset" to change)
goto :dispatch

:dispatch
if /I "%MODE%"=="node" goto :run_node
if /I "%MODE%"=="python" goto :run_python
goto :run_browser

:run_node
if not "%HAS_NODE%"=="1" (
    echo Node.js not found. Falling back to direct browser mode...
    goto :run_browser
)
node "%PORTAL_DIR%server.mjs" %2
exit /b %errorlevel%

:run_python
if not "%HAS_PY%"=="1" goto :run_browser
echo Starting Python local server on http://127.0.0.1:4173/portal/ ...
start "" "http://127.0.0.1:4173/portal/"
pushd "%PORTAL_DIR%.."
python -m http.server 4173 --bind 127.0.0.1
popd
exit /b %errorlevel%

:run_browser
start "" "%PORTAL_DIR%index.html"
exit /b 0
