# 🎵 Bot de Música Discord Moderno

Um bot de música Discord completamente modernizado com funcionalidades avançadas, interface moderna e arquitetura escalável.

## ✨ Funcionalidades

### 🎵 Música
- **Reprodução de músicas** do YouTube por nome ou URL
- **Fila de músicas** com controle avançado
- **Controles interativos** com botões
- **Pausar/Resumir** música atual
- **Pular** para próxima música
- **Parar** e sair do canal
- **Auto-disconnect** após inatividade

### 🔧 Recursos Técnicos
- **Slash Commands** modernos
- **Sistema de logs** avançado
- **Tratamento de erros** robusto
- **Configuração segura** com variáveis de ambiente
- **Arquitetura modular** e escalável
- **Performance otimizada**

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Discord Developer

### 1. Clone o repositório

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Bot Discord
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=seu_client_id_aqui

# Configurações do YouTube (opcional)
YOUTUBE_API_KEY=sua_api_key_aqui

# Configurações do Bot
PREFIX=!
NODE_ENV=development

# Configurações de Log
LOG_LEVEL=info
```

### 4. Configure o Bot Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá para a seção "Bot"
4. Copie o token e adicione ao `.env`
5. Em "Privileged Gateway Intents", ative:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### 5. Convide o bot para seu servidor
Use este link (substitua CLIENT_ID pelo seu):
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## 🎮 Comandos Disponíveis

### Comandos de Música
- `/play <música>` - Toca uma música do YouTube
- `/skip` - Pula para a próxima música
- `/pause` - Pausa ou resuma a música atual
- `/queue` - Mostra a fila de músicas
- `/stop` - Para a música e sai do canal

### Comandos Gerais
- `/ping` - Mostra a latência do bot
- `/help` - Mostra informações sobre os comandos

## 🏗️ Estrutura do Projeto

```
src/
├── commands/           # Comandos organizados por categoria
│   ├── music/         # Comandos de música
│   └── general/       # Comandos gerais
├── config/            # Configurações
├── handlers/          # Gerenciadores de eventos
├── services/          # Serviços (música, etc.)
├── utils/             # Utilitários (logger, embeds)
└── index.js           # Arquivo principal
```

## 🛠️ Desenvolvimento

### Scripts Disponíveis
```bash
# Iniciar em modo desenvolvimento
npm run dev

# Iniciar em produção
npm start

# Executar testes
npm test

# Linting
npm run lint

# Formatação
npm run format
```

### Adicionando Novos Comandos
1. Crie um arquivo na pasta `src/commands/[categoria]/`
2. Use o template:
```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('nome')
        .setDescription('Descrição'),
    
    async execute(interaction) {
        // Sua lógica aqui
    }
};
```

## 🔧 Configuração Avançada

### Logs
O bot usa Winston para logging. Logs são salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs

### Performance
- **Auto-disconnect**: Bot sai automaticamente após 5 minutos de inatividade
- **Queue limit**: Máximo 50 músicas por servidor
- **Volume control**: Controle de volume por servidor

## 🐛 Solução de Problemas

### Erro de Permissões
Certifique-se de que o bot tem as permissões necessárias:
- Conectar
- Falar
- Usar VAD
- Enviar Mensagens
- Usar Slash Commands

### Erro de Áudio
- Verifique se o FFmpeg está instalado
- Certifique-se de que as dependências de áudio estão instaladas

### Bot não responde
- Verifique se o token está correto
- Confirme se os intents estão habilitados
- Verifique os logs em `logs/error.log`

## 📝 Changelog

### v2.0.0 - Modernização Completa
- ✅ Migração para Discord.js v14
- ✅ Implementação de Slash Commands
- ✅ Sistema de música moderno com play-dl
- ✅ Interface com botões interativos
- ✅ Sistema de logs avançado
- ✅ Arquitetura modular
- ✅ Tratamento de erros robusto
- ✅ Configuração segura

### v1.0.0 - Versão Original
- Bot básico com comandos de prefixo
- Funcionalidades limitadas de música

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [Discord.js](https://discord.js.org/) - Framework principal
- [play-dl](https://github.com/play-dl/play-dl) - Biblioteca de música
- [Winston](https://github.com/winstonjs/winston) - Sistema de logs

---

**Desenvolvido com ❤️**
