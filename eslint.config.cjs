const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react,
            'react-native': reactNative,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                __DEV__: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
            },
        },
        rules: {
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react-native/no-unused-styles': 'warn',
            'react-native/no-inline-styles': 'warn',
            'react-native/no-color-literals': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];