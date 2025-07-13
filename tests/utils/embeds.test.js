import { EmbedService } from '../../src/utils/embeds.js';

describe('EmbedService', () => {
    describe('createEmbed', () => {
        it('should create a basic embed', () => {
            const embed = EmbedService.createEmbed({
                title: 'Test Title',
                description: 'Test Description'
            });

            expect(embed.title).toBe('Test Title');
            expect(embed.description).toBe('Test Description');
        });

        it('should create embed with fields', () => {
            const fields = [
                { name: 'Field 1', value: 'Value 1', inline: true },
                { name: 'Field 2', value: 'Value 2', inline: false }
            ];

            const embed = EmbedService.createEmbed({
                title: 'Test',
                fields
            });

            expect(embed.fields).toHaveLength(2);
            expect(embed.fields[0].name).toBe('Field 1');
        });
    });

    describe('success', () => {
        it('should create success embed', () => {
            const embed = EmbedService.success('Success Title', 'Success Message');
            
            expect(embed.title).toContain('✅');
            expect(embed.title).toContain('Success Title');
            expect(embed.description).toBe('Success Message');
        });
    });

    describe('error', () => {
        it('should create error embed', () => {
            const embed = EmbedService.error('Error Title', 'Error Message');
            
            expect(embed.title).toContain('❌');
            expect(embed.title).toContain('Error Title');
            expect(embed.description).toBe('Error Message');
        });
    });

    describe('warning', () => {
        it('should create warning embed', () => {
            const embed = EmbedService.warning('Warning Title', 'Warning Message');
            
            expect(embed.title).toContain('⚠️');
            expect(embed.title).toContain('Warning Title');
            expect(embed.description).toBe('Warning Message');
        });
    });

    describe('info', () => {
        it('should create info embed', () => {
            const embed = EmbedService.info('Info Title', 'Info Message');
            
            expect(embed.title).toContain('ℹ️');
            expect(embed.title).toContain('Info Title');
            expect(embed.description).toBe('Info Message');
        });
    });
}); 