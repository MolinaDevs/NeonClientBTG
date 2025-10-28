# =====================================================
# Script de Setup - BTG Tickets API
# Autor: Murilo Molina
# =====================================================

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   BTG Tickets API - Setup Inicial   " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Verificar .NET SDK
Write-Host "[1/6] Verificando .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "✓ .NET SDK encontrado: v$dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ .NET SDK não encontrado!" -ForegroundColor Red
    Write-Host "  Baixe em: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Verificar variáveis de ambiente
Write-Host "[2/6] Verificando variáveis de ambiente..." -ForegroundColor Yellow
$clientId = [System.Environment]::GetEnvironmentVariable('BTG_CLIENT_ID', 'Machine')
$clientSecret = [System.Environment]::GetEnvironmentVariable('BTG_CLIENT_SECRET', 'Machine')

if (-not $clientId -or -not $clientSecret) {
    Write-Host "✗ Variáveis de ambiente não configuradas!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Configure com:" -ForegroundColor Yellow
    Write-Host '  [System.Environment]::SetEnvironmentVariable("BTG_CLIENT_ID", "4fvga0jg4u8ui9f5p6e1ijs5mp", "Machine")' -ForegroundColor Cyan
    Write-Host '  [System.Environment]::SetEnvironmentVariable("BTG_CLIENT_SECRET", "121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5", "Machine")' -ForegroundColor Cyan
    Write-Host ""
    
    $response = Read-Host "  Deseja configurar agora? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host "  Configurando variáveis de ambiente..." -ForegroundColor Yellow
        [System.Environment]::SetEnvironmentVariable('BTG_CLIENT_ID', '4fvga0jg4u8ui9f5p6e1ijs5mp', 'Machine')
        [System.Environment]::SetEnvironmentVariable('BTG_CLIENT_SECRET', '121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5', 'Machine')
        Write-Host "✓ Variáveis configuradas!" -ForegroundColor Green
        Write-Host "  IMPORTANTE: Reinicie o PowerShell para aplicar as mudanças." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Variáveis de ambiente configuradas" -ForegroundColor Green
}

Write-Host ""

# Restaurar dependências
Write-Host "[3/6] Restaurando dependências..." -ForegroundColor Yellow
dotnet restore
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependências restauradas" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao restaurar dependências" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Compilar projeto
Write-Host "[4/6] Compilando projeto..." -ForegroundColor Yellow
dotnet build --configuration Release
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Projeto compilado com sucesso" -ForegroundColor Green
} else {
    Write-Host "✗ Erro na compilação" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar appsettings.json
Write-Host "[5/6] Verificando configuração..." -ForegroundColor Yellow
if (Test-Path "appsettings.json") {
    Write-Host "✓ appsettings.json encontrado" -ForegroundColor Green
    Write-Host "  Verifique se 'CreatedBy' está configurado com seu nome" -ForegroundColor Yellow
} else {
    Write-Host "✗ appsettings.json não encontrado" -ForegroundColor Red
    if (Test-Path "appsettings.EXAMPLE.json") {
        Write-Host "  Copiando de appsettings.EXAMPLE.json..." -ForegroundColor Yellow
        Copy-Item "appsettings.EXAMPLE.json" "appsettings.json"
        Write-Host "✓ Arquivo criado - edite e configure!" -ForegroundColor Green
    }
}

Write-Host ""

# Resumo
Write-Host "[6/6] Resumo do Setup" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✓ .NET SDK: OK" -ForegroundColor Green
Write-Host "✓ Dependências: OK" -ForegroundColor Green
Write-Host "✓ Compilação: OK" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Execute: dotnet run" -ForegroundColor Cyan
Write-Host "  2. Acesse: http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "  3. Teste autenticação e endpoints" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentação:" -ForegroundColor Yellow
Write-Host "  - README.md - Visão geral" -ForegroundColor Cyan
Write-Host "  - TESTES_FUNCIONAIS.md - Guia de testes" -ForegroundColor Cyan
Write-Host "  - INSTALACAO_SERVIDOR.md - Instalação completa" -ForegroundColor Cyan
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Setup concluído com sucesso!      " -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
