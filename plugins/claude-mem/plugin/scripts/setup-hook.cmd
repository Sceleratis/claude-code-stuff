@echo off
REM setup-hook.cmd - Auto-install dependencies and run context hook for Windows
REM This script runs in Windows CMD and doesn't require bash or Unix tools

setlocal enabledelayedexpansion

REM %~dp0 is the directory where this batch file is located (plugin/scripts/)
set SCRIPT_DIR=%~dp0
set PLUGIN_DIR=%SCRIPT_DIR%..
set PARENT_DIR=%PLUGIN_DIR%\..

REM Check if node_modules exists in the parent directory
if not exist "%PARENT_DIR%\node_modules" (
    echo [setup-hook] node_modules not found, installing dependencies... 1>&2
    
    REM Change to parent directory and run npm install
    pushd "%PARENT_DIR%"
    call npm install --silent >"%TEMP%\claude-mem-install.log" 2>&1
    
    if errorlevel 1 (
        echo [setup-hook] ERROR: npm install failed. Check %TEMP%\claude-mem-install.log 1>&2
        popd
        exit /b 1
    )
    
    popd
    echo [setup-hook] Dependencies installed successfully 1>&2
)

REM Run the context hook
node "%SCRIPT_DIR%context-hook.js"
exit /b %ERRORLEVEL%
