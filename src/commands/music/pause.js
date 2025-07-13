import { SlashCommandBuilder } from 'discord.js';
import { MusicService } from '../../services/MusicService.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausa ou resuma a música atual'),

    async execute(interaction) {
        try {
            const musicService = new MusicService();
            const queue = musicService.getQueue(interaction.guildId);

            if (!queue || !queue.currentTrack) {
                const embed = EmbedService.warning(
                    'Nada tocando',
                    'Não há música tocando no momento.'
                );
                return await interaction.reply({ embeds: [embed] });
            }

            let embed;
            let action;

            if (musicService.isPlaying(interaction.guildId)) {
                // Pausar
                musicService.pause(interaction.guildId);
                action = 'pausada';
            } else if (musicService.isPaused(interaction.guildId)) {
                // Resumir
                musicService.resume(interaction.guildId);
                action = 'resumida';
            } else {
                const embed = EmbedService.error(
                    'Erro',
                    'Não foi possível pausar/resumir a música.'
                );
                return await interaction.reply({ embeds: [embed] });
            }

            embed = EmbedService.success(
                'Música ' + action,
                `**${queue.currentTrack.title}** foi ${action}.`
            );
            await interaction.reply({ embeds: [embed] });
            
            log.command('pause', interaction.user, interaction.guild);
            
        } catch (error) {
            log.error('Erro no comando pause', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao pausar música',
                error.message
            );
            
            await interaction.reply({ embeds: [embed] });
        }
    }
}; 