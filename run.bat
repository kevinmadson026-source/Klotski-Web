@echo off
echo Iniciando servidor Node em /main...
cd /d "%~dp0main"
start cmd /k "node server.js"

echo Abrindo o navegador...
start http://localhost:3001

echo Tudo iniciado!