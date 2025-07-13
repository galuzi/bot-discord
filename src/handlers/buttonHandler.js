import { MusicService } from '../services/MusicService.js';
import { EmbedService } from '../utils/embeds.js';
import { log } from '../utils/logger.js';

export class ButtonHandler {
    constructor() {
        this.musicService = new MusicService();
    }

    async handleButton(interaction) {
        if (!interaction.isButton()) return;

        const { customId } = interaction;

        try {
            switch (customId) {
                case 'pause':
                    await this.handlePause(interaction);
                    break;
                case 'skip':
                    await this.handleSkip(interaction);
                    break;
                case 'stop':
                    await this.handleStop(interaction);
                    break;
                case 'queue':
                    await this.handleQueue(interaction);
                    break;
                case 'previous':
                    await this.handlePrevious(interaction);
                    break;
                default:
                    log.warn(`Botão não reconhecido: ${customId}`, {
                        user: interaction.user.tag,
                        guild: interaction.guild?.name
                    });
            }
        } catch (error) {
            log.error(`Erro ao processar botão ${customId}`, {
                error: error.message,
                user: interaction.user.tag,
                guild: interaction.guild?.name
            });

            const embed = EmbedService.error(
                'Erro',
                'Ocorreu um erro ao processar este botão.'
            );

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    async handlePause(interaction) {
        const queue = this.musicService.getQueue(interaction.guildId);

        if (!queue || !queue.currentTrack) {
            const embed = EmbedService.warning(
                'Nada tocando',
                'Não há música tocando no momento.'
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        let action;
        if (this.musicService.isPlaying(interaction.guildId)) {
            this.musicService.pause(interaction.guildId);
            action = 'pausada';
        } else if (this.musicService.isPaused(interaction.guildId)) {
            this.musicService.resume(interaction.guildId);
            action = 'resumida';
        } else {
            const embed = EmbedService.error(
                'Erro',
                'Não foi possível pausar/resumir a música.'
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = EmbedService.success(
            'Música ' + action,
            `**${queue.currentTrack.title}** foi ${action}.`
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    async handleSkip(interaction) {
        const queue = this.musicService.getQueue(interaction.guildId);

        if (!queue || !queue.currentTrack) {
            const embed = EmbedService.warning(
                'Nada tocando',
                'Não há música tocando no momento.'
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const skippedTrack = queue.currentTrack;
        const success = this.musicService.skip(interaction.guildId);

        if (success) {
            const embed = EmbedService.success(
                'Música pulada',
                `**${skippedTrack.title}** foi pulada.`
            );
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = EmbedService.error(
                'Erro ao pular',
                'Não foi possível pular a música atual.'
            );
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }

    async handleStop(interaction) {
        const queue = this.musicService.getQueue(interaction.guildId);

        if (!queue) {
            const embed = EmbedService.warning(
                'Bot não conectado',
                'O bot não está conectado a nenhum canal de voz.'
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        this.musicService.stop(interaction.guildId);
        
        const embed = EmbedService.success(
            'Música parada',
            'A música foi parada e o bot saiu do canal de voz.'
        );
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    async handleQueue(interaction) {
        const queue = this.musicService.getQueue(interaction.guildId);

        if (!queue || (!queue.currentTrack && queue.tracks.length === 0)) {
            const embed = EmbedService.info(
                'Fila vazia',
                'Não há músicas na fila no momento.'
            );
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = EmbedService.queueEmbed(queue.tracks, queue.currentTrack);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    async handlePrevious(interaction) {
        const embed = EmbedService.info(
            'Funcionalidade em desenvolvimento',
            'O botão "Anterior" será implementado em breve!'
        );
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
} 