module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env',   // how you’ll import it (import { API_URL } from '@env')
                    path: '.env',         // location of your .env file
                    safe: false,          // no need for a .env.example check
                    allowUndefined: true, // don’t crash if variable missing
                },
            ],
        ],
    }
}
