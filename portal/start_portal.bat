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

where node >nul 2>nul && set "HAS_NODE=1" || set "HAS_NODE=0"
where python >nul 2>nul && set "HAS_PY=1" || set "HAS_PY=0"

if defined MODE goto :dispatch

echo.
echo ============================================================
echo   Project Governance Portal - Local Launcher
echo ============================================================
if "%HAS_NODE%"=="1" (
    echo   [1] Live Local Server via Node.js (Recommended, 127.0.0.1)
    echo   [2] Direct Browser Mode (No server, select folder in browser)
    set /p CHOICE="Choose mode [1/2] (saved for future launches): "
    if "!CHOICE!"=="2" (set "MODE=browser") else (set "MODE=node")
) else if "%HAS_PY%"=="1" (
    echo   [1] Local Static Server via Python (127.0.0.1)
    echo   [2] Direct Browser Mode (Zero install, select folder in browser)
    echo   [3] Open Node.js download page (optional for live API mode)
    set /p CHOICE="Choose mode [1/2/3]: "
    if "!CHOICE!"=="3" (
        start "" "https://nodejs.org/"
        echo Install Node.js then re-run start_portal.bat.
        pause
        exit /b 0
    )
    if "!CHOICE!"=="2" (set "MODE=browser") else (set "MODE=python")
) else (
    echo   Node.js and Python were not detected on this machine.
    echo   [1] Direct Browser Mode (Recommended, zero install)
    echo   [2] Open Node.js download page (optional for live local server)
    set /p CHOICE="Choose mode [1/2]: "
    if "!CHOICE!"=="2" (
        start "" "https://nodejs.org/"
        echo Install Node.js then re-run start_portal.bat.
        pause
        exit /b 0
    )
    set "MODE=browser"
)

echo !MODE!>"%PREF_FILE%"
echo Saved preference: !MODE! (run "start_portal.bat --reset" to change)

:dispatch
if /I "%MODE%"=="node" (
    if "%HAS_NODE%"=="1" (
        node "%PORTAL_DIR%server.mjs"
        exit /b %errorlevel%
    ) else (
        echo Node.js not found. Falling back to direct browser mode...
        set "MODE=browser"
    )
)

if /I "%MODE%"=="python" (
    if "%HAS_PY%"=="1" (
        echo Starting Python local server on http://127.0.0.1:4173/portal/ ...
        start "" "http://127.0.0.1:4173/portal/"
        pushd "%PORTAL_DIR%.."
        python -m http.server 4173 --bind 127.0.0.1
        popd
        exit /b %errorlevel%
    ) else (
        set "MODE=browser"
    )
)

start "" "%PORTAL_DIR%index.html"
exit /b 0
