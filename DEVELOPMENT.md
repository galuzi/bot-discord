# 🛠️ Guia de Desenvolvimento

Este documento contém informações importantes para desenvolvedores que desejam contribuir ou entender o projeto.

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- Conhecimento básico de JavaScript ES6+
- Familiaridade com Discord.js

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas
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

### Padrões de Código

#### 1. Comandos
Todos os comandos seguem este padrão:
```javascript
import { SlashCommandBuilder } from 'discord.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('nome')
        .setDescription('Descrição'),
    
    async execute(interaction) {
        try {
            // Lógica do comando
            log.command('nome', interaction.user, interaction.guild);
        } catch (error) {
            log.error('Erro no comando', { error: error.message });
            // Tratamento de erro
        }
    }
};
```

#### 2. Serviços
Serviços são classes que encapsulam lógica de negócio:
```javascript
export class MeuServico {
    constructor() {
        // Inicialização
    }
    
    async metodo() {
        // Lógica do serviço
    }
}
```

#### 3. Utilitários
Utilitários são funções estáticas ou classes utilitárias:
```javascript
export class MeuUtilitario {
    static metodo() {
        // Lógica utilitária
    }
}
```

## 🔧 Configuração de Desenvolvimento

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Ambiente
```bash
cp env.example .env
```

### 3. Configurar Bot Discord
1. Crie uma aplicação no [Discord Developer Portal](https://discord.com/developers/applications)
2. Configure as permissões necessárias
3. Adicione o token ao `.env`

### 4. Deploy dos Comandos
```bash
npm run deploy
```

## 🧪 Testes

### Executar Testes
```bash
npm test
```

### Executar Testes com Coverage
```bash
npm test -- --coverage
```

### Estrutura de Testes
```
tests/
├── setup.js           # Configuração global
├── utils/             # Testes de utilitários
├── services/          # Testes de serviços
└── commands/          # Testes de comandos
```

### Padrão de Testes
```javascript
import { MeuServico } from '../../src/services/MeuServico.js';

describe('MeuServico', () => {
    let servico;
    
    beforeEach(() => {
        servico = new MeuServico();
    });
    
    it('should do something', () => {
        // Teste
    });
});
```

## 📝 Convenções de Código

### 1. Nomenclatura
- **Arquivos**: camelCase (ex: `musicService.js`)
- **Classes**: PascalCase (ex: `MusicService`)
- **Funções**: camelCase (ex: `playMusic`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `MAX_QUEUE_SIZE`)

### 2. Imports
```javascript
// Discord.js
import { Client, GatewayIntentBits } from 'discord.js';

// Utilitários internos
import { EmbedService } from '../utils/embeds.js';

// Serviços
import { MusicService } from '../services/MusicService.js';
```

### 3. Tratamento de Erros
```javascript
try {
    // Operação que pode falhar
} catch (error) {
    log.error('Contexto do erro', { 
        error: error.message, 
        user: interaction.user.tag 
    });
    
    const embed = EmbedService.error('Título', 'Mensagem');
    await interaction.reply({ embeds: [embed] });
}
```

### 4. Logging
```javascript
// Log de comando
log.command('nome', interaction.user, interaction.guild);

// Log de música
log.music('ação', { detalhes });

// Log de erro
log.error('contexto', { error: error.message });
```

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Deploy de Comandos
```bash
npm run deploy
```

## 🔍 Debugging

### Logs
- Logs são salvos em `logs/`
- Use `LOG_LEVEL=debug` para logs detalhados
- Logs de erro são salvos em `logs/error.log`

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

## 📚 Recursos Úteis

### Documentação
- [Discord.js Guide](https://discordjs.guide/)
- [Discord.js Documentation](https://discord.js.org/)
- [play-dl Documentation](https://github.com/play-dl/play-dl)

### Ferramentas
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Jest**: Framework de testes
- **Winston**: Sistema de logs

## 🤝 Contribuição

### 1. Fork o Projeto
```bash
git clone <seu-fork>
cd bot-discord-main
```

### 2. Crie uma Branch
```bash
git checkout -b feature/nova-funcionalidade
```

### 3. Desenvolva
- Siga os padrões de código
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada

### 4. Teste
```bash
npm run lint
npm test
npm run format
```

### 5. Commit e Push
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 6. Pull Request
- Crie um PR com descrição clara
- Inclua testes se aplicável
- Atualize documentação se necessário

## 🐛 Troubleshooting

### Problemas Comuns

#### Bot não responde
- Verifique se o token está correto
- Confirme se os intents estão habilitados
- Verifique os logs em `logs/error.log`

#### Erro de áudio
- Instale FFmpeg
- Verifique dependências de áudio
- Confirme permissões do bot

#### Comandos não aparecem
- Execute `npm run deploy`
- Aguarde até 1 hora para propagação global
- Verifique se o bot tem permissão para comandos

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs
3. Abra uma issue no GitHub
4. Entre em contato com a equipe

---

**Lembre-se: Código limpo é código feliz! 🎉** 