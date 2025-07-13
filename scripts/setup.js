#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

console.log('🚀 Configurando Bot de Música Discord...\n');

// Verificar Node.js
try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
        console.error('❌ Node.js 18+ é necessário. Versão atual:', nodeVersion);
        process.exit(1);
    }
    
    console.log('✅ Node.js versão:', nodeVersion);
} catch (error) {
    console.error('❌ Erro ao verificar versão do Node.js');
    process.exit(1);
}

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
    console.error('❌ Erro ao instalar dependências');
    process.exit(1);
}

// Criar arquivo .env se não existir
const envPath = join(process.cwd(), '.env');
if (!existsSync(envPath)) {
    console.log('\n📝 Criando arquivo .env...');
    
    const envContent = `# Configurações do Bot Discord
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui

# Configurações do YouTube (opcional)
YOUTUBE_API_KEY=sua_api_key_aqui

# Configurações do Bot
PREFIX=!
NODE_ENV=development

# Configurações de Log
LOG_LEVEL=info
`;
    
    writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env criado!');
} else {
    console.log('✅ Arquivo .env já existe');
}

// Criar pasta logs se não existir
const logsPath = join(process.cwd(), 'logs');
if (!existsSync(logsPath)) {
    console.log('\n📁 Criando pasta logs...');
    execSync('mkdir logs', { stdio: 'inherit' });
    console.log('✅ Pasta logs criada!');
} else {
    console.log('✅ Pasta logs já existe');
}

// Verificar se o arquivo .env está configurado
console.log('\n🔧 Verificando configuração...');
try {
    const envContent = readFileSync(envPath, 'utf8');
    
    if (envContent.includes('seu_token_aqui')) {
        console.log('⚠️  ATENÇÃO: Configure o arquivo .env com suas credenciais do Discord');
        console.log('📖 Veja o README.md para instruções detalhadas');
    } else {
        console.log('✅ Arquivo .env parece estar configurado');
    }
} catch (error) {
    console.error('❌ Erro ao ler arquivo .env');
}

// Mostrar próximos passos
console.log('\n🎉 Setup concluído!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure o arquivo .env com suas credenciais do Discord');
console.log('2. Execute: npm run deploy (para registrar os comandos)');
console.log('3. Execute: npm run dev (para iniciar o bot)');
console.log('\n📚 Consulte o README.md para mais informações');

console.log('\n✨ Bot pronto para uso!'); 