import { SlashCommandBuilder } from 'discord.js';
import { EmbedService } from '../../utils/embeds.js';
import { log } from '../../utils/logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Mostra a latência do bot'),

    async execute(interaction) {
        try {
            const sent = await interaction.reply({ 
                content: '🏓 Calculando ping...', 
                fetchReply: true 
            });
            
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);
            
            const embed = EmbedService.info(
                '🏓 Pong!',
                `Latência do bot: **${latency}ms**\nLatência da API: **${apiLatency}ms**`
            );
            
            await interaction.editReply({ content: null, embeds: [embed] });
            
            log.command('ping', interaction.user, interaction.guild);
            
        } catch (error) {
            log.error('Erro no comando ping', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao calcular ping',
                error.message
            );
            
            await interaction.editReply({ content: null, embeds: [embed] });
        }
    }
}; 