import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const commands = [];
const commandsPath = join(process.cwd(), 'src', 'commands');
const categories = readdirSync(commandsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const category of categories) {
    const categoryPath = join(commandsPath, category);
    const commandFiles = readdirSync(categoryPath)
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = join(categoryPath, file);
        const command = await import(filePath);
        
        if (command.default && command.default.data) {
            commands.push(command.default.data.toJSON());
            console.log(`✅ Comando carregado: ${command.default.data.name}`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🚀 Iniciando deploy dos comandos...');
        console.log(`📦 Total de comandos: ${commands.length}`);

        // Deploy global
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands }
        );

        console.log('✅ Comandos deployados com sucesso!');
        console.log('⏰ Os comandos estarão disponíveis em até 1 hora.');
        
    } catch (error) {
        console.error('❌ Erro no deploy:', error);
    }
})(); 