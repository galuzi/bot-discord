import { SlashCommandBuilder } from 'discord.js';
import { MusicService } from '../../services/MusicService.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Pula para a próxima música'),

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

            const skippedTrack = queue.currentTrack;
            const success = musicService.skip(interaction.guildId);

            if (success) {
                const embed = EmbedService.success(
                    'Música pulada',
                    `**${skippedTrack.title}** foi pulada.`
                );
                await interaction.reply({ embeds: [embed] });
                
                log.command('skip', interaction.user, interaction.guild);
            } else {
                const embed = EmbedService.error(
                    'Erro ao pular',
                    'Não foi possível pular a música atual.'
                );
                await interaction.reply({ embeds: [embed] });
            }
            
        } catch (error) {
            log.error('Erro no comando skip', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao pular música',
                error.message
            );
            
            await interaction.reply({ embeds: [embed] });
        }
    }
}; 