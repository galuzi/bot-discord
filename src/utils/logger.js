import winston from 'winston';
import { config } from '../config/config.js';

// Configuração de cores para o console
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'green'
};

winston.addColors(colors);

// Formato personalizado para logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        if (stack) {
            return `${timestamp} [${level}]: ${message}\n${stack}`;
        }
        return `${timestamp} [${level}]: ${message}`;
    })
);

// Criar logger
export const logger = winston.createLogger({
    level: config.logLevel,
    format: logFormat,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        
        // File transport para erros
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        
        // File transport para todos os logs
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

// Funções de conveniência
export const log = {
    info: (message, meta = {}) => logger.info(message, meta),
    warn: (message, meta = {}) => logger.warn(message, meta),
    error: (message, meta = {}) => logger.error(message, meta),
    debug: (message, meta = {}) => logger.debug(message, meta),
    
    // Log específico para comandos
    command: (command, user, guild) => {
        logger.info(`Comando executado: ${command}`, {
            user: user.tag,
            userId: user.id,
            guild: guild?.name,
            guildId: guild?.id
        });
    },
    
    // Log específico para música
    music: (action, details) => {
        logger.info(`Ação de música: ${action}`, details);
    }
}; 