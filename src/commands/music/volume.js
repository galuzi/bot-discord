import { SlashCommandBuilder } from 'discord.js';
import { MusicService } from '../../services/MusicService.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Controla o volume da música')
        .addIntegerOption(option =>
            option.setName('volume')
                .setDescription('Volume (0-100)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)),

    async execute(interaction) {
        try {
            const volume = interaction.options.getInteger('volume');
            const musicService = new MusicService();
            const queue = musicService.getQueue(interaction.guildId);

            if (!queue) {
                const embed = EmbedService.warning(
                    'Bot não conectado',
                    'O bot não está conectado a nenhum canal de voz.'
                );
                return await interaction.reply({ embeds: [embed] });
            }

            // Atualizar volume na fila
            queue.volume = volume;

            // Aplicar volume ao player atual se estiver tocando
            const player = musicService.players.get(interaction.guildId);
            if (player && player.state.resource) {
                player.state.resource.volume.setVolume(volume / 100);
            }

            const embed = EmbedService.success(
                'Volume alterado',
                `Volume definido para **${volume}%**`
            );
            await interaction.reply({ embeds: [embed] });
            
            log.command('volume', interaction.user, interaction.guild);
            
        } catch (error) {
            log.error('Erro no comando volume', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao alterar volume',
                error.message
            );
            
            await interaction.reply({ embeds: [embed] });
        }
    }
}; 