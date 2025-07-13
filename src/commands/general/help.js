import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { config } from '../../config/config.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Mostra informações sobre os comandos disponíveis'),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎵 Bot de Música - Comandos')
                .setDescription('Aqui estão todos os comandos disponíveis:')
                .addFields(
                    {
                        name: '🎵 Comandos de Música',
                        value: [
                            '`/play <música>` - Toca uma música do YouTube',
                            '`/skip` - Pula para a próxima música',
                            '`/pause` - Pausa ou resuma a música atual',
                            '`/queue` - Mostra a fila de músicas',
                            '`/stop` - Para a música e sai do canal'
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '🔧 Comandos Gerais',
                        value: [
                            '`/ping` - Mostra a latência do bot',
                            '`/help` - Mostra esta mensagem de ajuda'
                        ].join('\n'),
                        inline: false
                    },
                    {
                        name: '📝 Como usar',
                        value: 'Para usar o bot, você precisa estar em um canal de voz. Use `/play` seguido do nome da música ou URL do YouTube.',
                        inline: false
                    }
                )
                .setFooter({ text: 'Bot desenvolvido com ❤️ usando Discord.js v14' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Erro')
                .setDescription('Ocorreu um erro ao mostrar a ajuda.')
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed] });
        }
    }
}; 