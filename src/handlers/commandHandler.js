import { readdirSync } from 'fs';
import { join } from 'path';
import { log } from '../utils/logger.js';

export class CommandHandler {
    constructor(client) {
        this.client = client;
        this.commands = new Map();
    }

    async loadCommands() {
        try {
            const commandsPath = join(process.cwd(), 'src', 'commands');
            const categories = readdirSync(commandsPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            for (const category of categories) {
                const categoryPath = join(commandsPath, category);
                const commandFiles = readdirSync(categoryPath)
                    .filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    try {
                        const filePath = join(categoryPath, file);
                        const command = await import(filePath);
                        
                        if (command.default && command.default.data) {
                            this.commands.set(command.default.data.name, command.default);
                            log.info(`Comando carregado: ${command.default.data.name}`, { category });
                        }
                    } catch (error) {
                        log.error(`Erro ao carregar comando ${file}`, { error: error.message });
                    }
                }
            }

            log.info(`Total de comandos carregados: ${this.commands.size}`);
        } catch (error) {
            log.error('Erro ao carregar comandos', { error: error.message });
        }
    }

    async registerCommands() {
        try {
            const commands = Array.from(this.commands.values()).map(cmd => cmd.data.toJSON());
            
            await this.client.application.commands.set(commands);
            log.info(`Comandos registrados: ${commands.length}`);
        } catch (error) {
            log.error('Erro ao registrar comandos', { error: error.message });
        }
    }

    async handleInteraction(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = this.commands.get(interaction.commandName);
        
        if (!command) {
            log.warn(`Comando não encontrado: ${interaction.commandName}`, {
                user: interaction.user.tag,
                guild: interaction.guild?.name
            });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            log.error(`Erro ao executar comando ${interaction.commandName}`, {
                error: error.message,
                user: interaction.user.tag,
                guild: interaction.guild?.name
            });

            const errorMessage = 'Ocorreu um erro ao executar este comando.';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
} 