import { SlashCommandBuilder } from 'discord.js';
import { MusicService } from '../../services/MusicService.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Mostra a fila de músicas'),

    async execute(interaction) {
        try {
            const musicService = new MusicService();
            const queue = musicService.getQueue(interaction.guildId);

            if (!queue || (!queue.currentTrack && queue.tracks.length === 0)) {
                const embed = EmbedService.info(
                    'Fila vazia',
                    'Não há músicas na fila no momento.'
                );
                return await interaction.reply({ embeds: [embed] });
            }

            const embed = EmbedService.queueEmbed(queue.tracks, queue.currentTrack);
            await interaction.reply({ embeds: [embed] });
            
            log.command('queue', interaction.user, interaction.guild);
            
        } catch (error) {
            log.error('Erro no comando queue', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao mostrar fila',
                error.message
            );
            
            await interaction.reply({ embeds: [embed] });
        }
    }
}; 