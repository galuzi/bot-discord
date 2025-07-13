import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
    // Discord
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    
    // Bot
    prefix: process.env.PREFIX || '!',
    
    // YouTube
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    
    // Ambiente
    environment: process.env.NODE_ENV || 'development',
    
    // Log
    logLevel: process.env.LOG_LEVEL || 'info',
    
    // Configurações de música
    music: {
        maxQueueSize: 50,
        maxVolume: 100,
        defaultVolume: 50,
        leaveTimeout: 300000, // 5 minutos
        searchResults: 5
    },
    
    // Cores para embeds
    colors: {
        primary: '#5865F2',
        success: '#57F287',
        warning: '#FEE75C',
        error: '#ED4245',
        info: '#5865F2'
    }
};

// Validação das configurações obrigatórias
export function validateConfig() {
    const required = ['token', 'clientId'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        throw new Error(`Configurações obrigatórias ausentes: ${missing.join(', ')}`);
    }
} 