import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { config } from '../../config/config.js';
import { log } from '../../utils/logger.js';
import os from 'os';

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Mostra informações sobre o bot'),

    async execute(interaction) {
        try {
            const client = interaction.client;
            const uptime = this.formatUptime(client.uptime);
            const memoryUsage = process.memoryUsage();
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🤖 Informações do Bot')
                .setThumbnail(client.user.displayAvatarURL())
                .addFields(
                    {
                        name: '📊 Estatísticas',
                        value: [
                            `**Servidores:** ${client.guilds.cache.size}`,
                            `**Usuários:** ${client.users.cache.size}`,
                            `**Canais:** ${client.channels.cache.size}`,
                            `**Uptime:** ${uptime}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '💻 Sistema',
                        value: [
                            `**Node.js:** ${process.version}`,
                            `**Plataforma:** ${os.platform()}`,
                            `**Arquitetura:** ${os.arch()}`,
                            `**CPU:** ${os.cpus()[0].model}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🧠 Memória',
                        value: [
                            `**RSS:** ${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                            `**Heap Used:** ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                            `**Heap Total:** ${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                            `**External:** ${Math.round(memoryUsage.external / 1024 / 1024)}MB`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🔧 Tecnologias',
                        value: [
                            '**Discord.js:** v14.14.1',
                            '**play-dl:** v1.9.7',
                            '**Winston:** v3.11.0',
                            '**Node.js:** 18+'
                        ].join('\n'),
                        inline: false
                    }
                )
                .setFooter({ 
                    text: `Solicitado por ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
            
            log.command('info', interaction.user, interaction.guild);
            
        } catch (error) {
            log.error('Erro no comando info', { error: error.message, user: interaction.user.tag });
            
            const embed = EmbedService.error(
                'Erro ao mostrar informações',
                error.message
            );
            
            await interaction.reply({ embeds: [embed] });
        }
    },

    formatUptime(ms) {
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
}; 