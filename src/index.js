import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config, validateConfig } from './config/config.js';
import { log } from './utils/logger.js';
import { CommandHandler } from './handlers/commandHandler.js';
import { ButtonHandler } from './handlers/buttonHandler.js';
import cron from 'node-cron';

class DiscordBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.commandHandler = new CommandHandler(this.client);
        this.buttonHandler = new ButtonHandler();
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Evento de ready
        this.client.once('ready', async () => {
            log.info(`Bot online como ${this.client.user.tag}`, {
                id: this.client.user.id,
                guilds: this.client.guilds.cache.size
            });

            // Carregar e registrar comandos
            await this.commandHandler.loadCommands();
            await this.commandHandler.registerCommands();

            // Configurar status do bot
            this.client.user.setActivity('🎵 /help para comandos', { type: 'PLAYING' });

            // Agendar tarefas
            this.scheduleTasks();
        });

        // Evento de interação
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isChatInputCommand()) {
                await this.commandHandler.handleInteraction(interaction);
            } else if (interaction.isButton()) {
                await this.buttonHandler.handleButton(interaction);
            }
        });

        // Evento de erro
        this.client.on('error', (error) => {
            log.error('Erro no cliente Discord', { error: error.message });
        });

        // Evento de warn
        this.client.on('warn', (warning) => {
            log.warn('Aviso do Discord.js', { warning });
        });

        // Evento de debug
        if (config.environment === 'development') {
            this.client.on('debug', (info) => {
                log.debug('Debug do Discord.js', { info });
            });
        }
    }

    scheduleTasks() {
        // Atualizar status a cada 30 minutos
        cron.schedule('*/30 * * * *', () => {
            const activities = [
                { name: '🎵 /help para comandos', type: 'PLAYING' },
                { name: `${this.client.guilds.cache.size} servidores`, type: 'WATCHING' },
                { name: 'músicas incríveis', type: 'LISTENING' }
            ];

            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            this.client.user.setActivity(randomActivity.name, { type: randomActivity.type });
            
            log.debug('Status do bot atualizado', { activity: randomActivity });
        });

        // Log de estatísticas diárias
        cron.schedule('0 0 * * *', () => {
            const stats = {
                guilds: this.client.guilds.cache.size,
                users: this.client.users.cache.size,
                uptime: this.formatUptime(this.client.uptime)
            };

            log.info('Estatísticas diárias do bot', stats);
        });
    }

    formatUptime(ms) {
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    async start() {
        try {
            // Validar configurações
            validateConfig();

            // Conectar ao Discord
            await this.client.login(config.token);
            
            log.info('Bot iniciado com sucesso!');
            
        } catch (error) {
            log.error('Erro ao iniciar bot', { error: error.message });
            process.exit(1);
        }
    }

    async stop() {
        try {
            log.info('Desligando bot...');
            await this.client.destroy();
            process.exit(0);
        } catch (error) {
            log.error('Erro ao desligar bot', { error: error.message });
            process.exit(1);
        }
    }
}

// Criar e iniciar bot
const bot = new DiscordBot();

// Manipular sinais de término
process.on('SIGINT', () => {
    log.info('Recebido SIGINT, desligando...');
    bot.stop();
});

process.on('SIGTERM', () => {
    log.info('Recebido SIGTERM, desligando...');
    bot.stop();
});

// Manipular erros não capturados
process.on('uncaughtException', (error) => {
    log.error('Erro não capturado', { error: error.message, stack: error.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Promise rejeitada não tratada', { reason, promise });
    process.exit(1);
});

// Iniciar bot
bot.start(); 