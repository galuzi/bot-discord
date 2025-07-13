import { SlashCommandBuilder } from 'discord.js';
import { MusicService } from '../../services/MusicService.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Toca uma música do YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Nome da música ou URL do YouTube')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply();
            
            const query = interaction.options.getString('query');
            const musicService = new MusicService();

            // Conectar ao canal de voz se necessário
            if (!musicService.getQueue(interaction.guildId)) {
                await musicService.joinVoiceChannel(interaction);
            }

            // Adicionar música à fila
            const track = await musicService.addTrack(interaction, query);
            
            const embed = EmbedService.musicEmbed(track, '🎵 Adicionado à fila');
            
            await interaction.editReply({ embeds: [embed] });
            
            log.command('play', interaction.user, interaction.guild);
            
        } catch (error) {
            log.error('Erro no comando play', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao tocar música',
                error.message
            );
            
            await interaction.editReply({ embeds: [embed] });
        }
    }
}; 