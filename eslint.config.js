export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly'
            }
        },
        rules: {
            // Regras de qualidade de código
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off', // Permitir console para logs
            'no-debugger': 'error',
            'no-alert': 'error',
            
            // Regras de estilo
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'never'],
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
            
            // Regras de variáveis
            'no-var': 'error',
            'prefer-const': 'error',
            'no-const-assign': 'error',
            
            // Regras de funções
            'prefer-arrow-callback': 'error',
            'arrow-spacing': 'error',
            'no-duplicate-imports': 'error',
            
            // Regras de objetos
            'object-shorthand': 'error',
            'prefer-template': 'error',
            
            // Regras de controle de fluxo
            'no-else-return': 'error',
            'no-nested-ternary': 'error',
            
            // Regras de segurança
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            
            // Regras específicas para Node.js
            'node/no-unsupported-features/es-syntax': 'off',
            'node/no-missing-import': 'off'
        }
    }
]; 