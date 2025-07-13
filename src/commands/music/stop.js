import { SlashCommandBuilder } from 'discord.js';
import { MusicService } from '../../services/MusicService.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Para a música e sai do canal de voz'),

    async execute(interaction) {
        try {
            const musicService = new MusicService();
            const queue = musicService.getQueue(interaction.guildId);

            if (!queue) {
                const embed = EmbedService.warning(
                    'Bot não conectado',
                    'O bot não está conectado a nenhum canal de voz.'
                );
                return await interaction.reply({ embeds: [embed] });
            }

            musicService.stop(interaction.guildId);
            
            const embed = EmbedService.success(
                'Música parada',
                'A música foi parada e o bot saiu do canal de voz.'
            );
            await interaction.reply({ embeds: [embed] });
            
            log.command('stop', interaction.user, interaction.guild);
            
        } catch (error) {
            log.error('Erro no comando stop', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao parar música',
                error.message
            );
            
            await interaction.reply({ embeds: [embed] });
        }
    }
}; 