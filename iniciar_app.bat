@echo off
echo ==========================================
echo Iniciando RentTruth en modo Desarrollo...
echo ==========================================
echo.
echo Abriendo navegador y servidor...
echo.

cd /d "%~dp0"

:: Inicia el servidor
start "" http://localhost:3000
npm run dev

pause
