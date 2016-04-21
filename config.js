require('dotenv').load();

const environment = {
    development: {
        isDevelopment: true,
        devTools: false
    },
    production: {
        isProduction: true
    }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
    port: process.env.LC_APP_PORT || process.env.PORT || 3000,

    LC_APP_ID: process.env.LC_APP_ID,
    LC_APP_KEY: process.env.LC_APP_KEY,
    LC_APP_MASTER_KEY: process.env.LC_APP_MASTER_KEY
}, environment);
