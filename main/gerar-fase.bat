@echo off
setlocal enabledelayedexpansion

:: Solicita ao usuário o valor para a variável total
set /p total_value="Digite o total de fases: "
set /p total_v="Digite o total de pecas azul: "
set /p total_h="Digite o total de pecas verde: "
set /p total_p="Digite o total de pecas amarelas: "

:: Substitui o valor de total no arquivo gerar-fases.js
echo Substituindo o valor no arquivo gerar-fases.js...

:: Usa o comando powershell para alterar o conteúdo do arquivo gerar-fases.js
powershell -Command "(Get-Content gerar-fases.js) -replace 'total = .*;', 'TOTAL = %total_value%;' | Set-Content gerar-fases.js"

powershell -Command "(Get-Content gerar-fases.js) -replace 'qtd_verticais = .*;', 'qtd_verticais = %total_v%;' | Set-Content gerar-fases.js"
powershell -Command "(Get-Content gerar-fases.js) -replace 'qtd_horizontal = .*;', 'qtd_horizontal = %total_h%;' | Set-Content gerar-fases.js"
powershell -Command "(Get-Content gerar-fases.js) -replace 'qtd_pequenas = .*;', 'qtd_pequenas = %total_p%;' | Set-Content gerar-fases.js"

:: Executa o script node
echo Executando o script gerar-fases.js...
node gerar-fases.js

:: Finaliza
echo Processo concluido!
pause
