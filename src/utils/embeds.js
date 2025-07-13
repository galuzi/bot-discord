import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { config } from '../config/config.js';

export class EmbedService {
    static createEmbed(options = {}) {
        const {
            title,
            description,
            color = config.colors.primary,
            fields = [],
            thumbnail,
            image,
            footer,
            timestamp = true,
            author
        } = options;

        const embed = new EmbedBuilder()
            .setColor(color);

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (image) embed.setImage(image);
        if (footer) embed.setFooter(footer);
        if (timestamp) embed.setTimestamp();
        if (author) embed.setAuthor(author);
        if (fields.length > 0) embed.addFields(fields);

        return embed;
    }

    // Embed de sucesso
    static success(title, description, fields = []) {
        return this.createEmbed({
            title: `✅ ${title}`,
            description,
            color: config.colors.success,
            fields
        });
    }

    // Embed de erro
    static error(title, description, fields = []) {
        return this.createEmbed({
            title: `❌ ${title}`,
            description,
            color: config.colors.error,
            fields
        });
    }

    // Embed de aviso
    static warning(title, description, fields = []) {
        return this.createEmbed({
            title: `⚠️ ${title}`,
            description,
            color: config.colors.warning,
            fields
        });
    }

    // Embed de informação
    static info(title, description, fields = []) {
        return this.createEmbed({
            title: `ℹ️ ${title}`,
            description,
            color: config.colors.info,
            fields
        });
    }

    // Embed para música
    static musicEmbed(track, action = 'Adicionado à fila') {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`🎵 ${action}`)
            .setDescription(`**${track.title}**`)
            .setThumbnail(track.thumbnail)
            .addFields(
                { name: 'Duração', value: track.duration, inline: true },
                { name: 'Canal', value: track.channel, inline: true },
                { name: 'URL', value: `[Clique aqui](${track.url})`, inline: false }
            )
            .setTimestamp();

        return embed;
    }

    // Embed para fila de música
    static queueEmbed(queue, currentTrack) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🎵 Fila de Músicas')
            .setTimestamp();

        if (currentTrack) {
            embed.addFields({
                name: '🎶 Tocando agora',
                value: `**${currentTrack.title}**\nDuração: ${currentTrack.duration}\nCanal: ${currentTrack.channel}`,
                inline: false
            });
        }

        if (queue.length > 0) {
            const queueList = queue.slice(0, 10).map((track, index) => 
                `${index + 1}. **${track.title}** - ${track.duration}`
            ).join('\n');

            embed.addFields({
                name: `📋 Próximas músicas (${queue.length})`,
                value: queueList,
                inline: false
            });

            if (queue.length > 10) {
                embed.addFields({
                    name: '...',
                    value: `E mais ${queue.length - 10} músicas`,
                    inline: false
                });
            }
        } else {
            embed.addFields({
                name: '📋 Fila vazia',
                value: 'Não há músicas na fila',
                inline: false
            });
        }

        return embed;
    }

    // Botões para controle de música
    static musicControls() {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('⏮️ Anterior')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setLabel('⏸️ Pausar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('⏭️ Pular')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('⏹️ Parar')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('queue')
                    .setLabel('📋 Fila')
                    .setStyle(ButtonStyle.Secondary)
            );

        return row;
    }
} 