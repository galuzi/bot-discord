import { 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    NoSubscriberBehavior,
    joinVoiceChannel,
    VoiceConnectionStatus
} from '@discordjs/voice';
import play from 'play-dl';
import { EmbedService } from '../utils/embeds.js';
import { log } from '../utils/logger.js';
import { config } from '../config/config.js';

export class MusicService {
    constructor() {
        this.queues = new Map();
        this.players = new Map();
        this.connections = new Map();
        this.timeouts = new Map();
    }

    // Estrutura de dados para fila de música
    createQueue(guildId) {
        return {
            tracks: [],
            currentTrack: null,
            volume: config.music.defaultVolume,
            loop: false,
            shuffle: false,
            textChannel: null,
            voiceChannel: null
        };
    }

    // Conectar ao canal de voz
    async joinVoiceChannel(interaction) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            throw new Error('Você precisa estar em um canal de voz!');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        });

        // Configurar player de áudio
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        // Configurar fila se não existir
        if (!this.queues.has(guild.id)) {
            this.queues.set(guild.id, this.createQueue(guild.id));
        }

        const queue = this.queues.get(guild.id);
        queue.voiceChannel = voiceChannel;
        queue.textChannel = interaction.channel;

        // Configurar eventos do player
        player.on(AudioPlayerStatus.Idle, () => {
            this.handleTrackEnd(guild.id);
        });

        player.on(AudioPlayerStatus.Playing, () => {
            log.music('Track started playing', { guildId: guild.id, track: queue.currentTrack?.title });
        });

        player.on('error', (error) => {
            log.error('Erro no player de áudio', { error: error.message, guildId: guild.id });
            this.handleTrackEnd(guild.id);
        });

        // Configurar eventos da conexão
        connection.on(VoiceConnectionStatus.Ready, () => {
            log.info('Conectado ao canal de voz', { guildId: guild.id, channel: voiceChannel.name });
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            log.warn('Desconectado do canal de voz', { guildId: guild.id });
            this.handleDisconnect(guild.id);
        });

        this.players.set(guild.id, player);
        this.connections.set(guild.id, connection);
        connection.subscribe(player);

        return { connection, player, queue };
    }

    // Adicionar música à fila
    async addTrack(interaction, query) {
        const { guild } = interaction;
        const queue = this.queues.get(guild.id);

        if (!queue) {
            throw new Error('Bot não está conectado a um canal de voz!');
        }

        try {
            let track;

            // Verificar se é URL do YouTube
            if (play.yt_validate(query) === 'video') {
                const video = await play.video_info(query);
                track = {
                    title: video.video_details.title,
                    url: query,
                    duration: this.formatDuration(video.video_details.durationInSec),
                    thumbnail: video.video_details.thumbnails[0].url,
                    channel: video.video_details.channel.name,
                    durationInSec: video.video_details.durationInSec
                };
            } else if (play.yt_validate(query) === 'playlist') {
                // Buscar primeira música da playlist
                const playlist = await play.playlist_info(query);
                const firstVideo = playlist.videos[0];
                track = {
                    title: firstVideo.title,
                    url: firstVideo.url,
                    duration: this.formatDuration(firstVideo.durationInSec),
                    thumbnail: firstVideo.thumbnails[0].url,
                    channel: firstVideo.channel.name,
                    durationInSec: firstVideo.durationInSec
                };
            } else {
                // Buscar no YouTube
                const searchResults = await play.search(query, { limit: 1 });
                if (searchResults.length === 0) {
                    throw new Error('Nenhuma música encontrada!');
                }

                const video = searchResults[0];
                track = {
                    title: video.title,
                    url: video.url,
                    duration: this.formatDuration(video.durationInSec),
                    thumbnail: video.thumbnails[0].url,
                    channel: video.channel.name,
                    durationInSec: video.durationInSec
                };
            }

            queue.tracks.push(track);
            log.music('Track added to queue', { 
                guildId: guild.id, 
                track: track.title, 
                queueSize: queue.tracks.length 
            });

            // Se não há música tocando, começar a tocar
            if (!queue.currentTrack) {
                await this.playNext(guild.id);
            }

            return track;
        } catch (error) {
            log.error('Erro ao adicionar música', { error: error.message, query });
            throw new Error('Erro ao processar a música. Verifique se o link é válido.');
        }
    }

    // Tocar próxima música
    async playNext(guildId) {
        const queue = this.queues.get(guildId);
        const player = this.players.get(guildId);

        if (!queue || !player) return;

        if (queue.tracks.length === 0) {
            queue.currentTrack = null;
            this.startLeaveTimeout(guildId);
            return;
        }

        const track = queue.tracks.shift();
        queue.currentTrack = track;

        try {
            const stream = await play.stream(track.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type,
                inlineVolume: true
            });

            resource.volume.setVolume(queue.volume / 100);
            player.play(resource);

            // Enviar embed com informações da música
            if (queue.textChannel) {
                const embed = EmbedService.musicEmbed(track, '🎵 Tocando agora');
                const controls = EmbedService.musicControls();
                await queue.textChannel.send({ embeds: [embed], components: [controls] });
            }

            log.music('Started playing track', { guildId, track: track.title });
        } catch (error) {
            log.error('Erro ao tocar música', { error: error.message, track: track.title });
            await this.playNext(guildId); // Tentar próxima música
        }
    }

    // Pausar música
    pause(guildId) {
        const player = this.players.get(guildId);
        if (player && player.state.status === AudioPlayerStatus.Playing) {
            player.pause();
            return true;
        }
        return false;
    }

    // Resumir música
    resume(guildId) {
        const player = this.players.get(guildId);
        if (player && player.state.status === AudioPlayerStatus.Paused) {
            player.unpause();
            return true;
        }
        return false;
    }

    // Pular música
    skip(guildId) {
        const player = this.players.get(guildId);
        if (player) {
            player.stop();
            return true;
        }
        return false;
    }

    // Parar música e limpar fila
    stop(guildId) {
        const player = this.players.get(guildId);
        const queue = this.queues.get(guildId);

        if (player) {
            player.stop();
        }

        if (queue) {
            queue.tracks = [];
            queue.currentTrack = null;
        }

        this.leaveVoiceChannel(guildId);
    }

    // Sair do canal de voz
    leaveVoiceChannel(guildId) {
        const connection = this.connections.get(guildId);
        const player = this.players.get(guildId);

        if (connection) {
            connection.destroy();
            this.connections.delete(guildId);
        }

        if (player) {
            player.stop();
            this.players.delete(guildId);
        }

        this.queues.delete(guildId);
        this.clearLeaveTimeout(guildId);

        log.info('Bot saiu do canal de voz', { guildId });
    }

    // Manipular fim da música
    handleTrackEnd(guildId) {
        const queue = this.queues.get(guildId);
        
        if (queue && queue.loop && queue.currentTrack) {
            // Modo loop: adicionar música atual de volta à fila
            queue.tracks.push(queue.currentTrack);
        }

        this.playNext(guildId);
    }

    // Manipular desconexão
    handleDisconnect(guildId) {
        this.startLeaveTimeout(guildId);
    }

    // Timeout para sair automaticamente
    startLeaveTimeout(guildId) {
        this.clearLeaveTimeout(guildId);
        
        const timeout = setTimeout(() => {
            this.leaveVoiceChannel(guildId);
        }, config.music.leaveTimeout);

        this.timeouts.set(guildId, timeout);
    }

    clearLeaveTimeout(guildId) {
        const timeout = this.timeouts.get(guildId);
        if (timeout) {
            clearTimeout(timeout);
            this.timeouts.delete(guildId);
        }
    }

    // Formatar duração
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Obter informações da fila
    getQueue(guildId) {
        return this.queues.get(guildId);
    }

    // Verificar se está tocando
    isPlaying(guildId) {
        const player = this.players.get(guildId);
        return player && player.state.status === AudioPlayerStatus.Playing;
    }

    // Verificar se está pausado
    isPaused(guildId) {
        const player = this.players.get(guildId);
        return player && player.state.status === AudioPlayerStatus.Paused;
    }
} 