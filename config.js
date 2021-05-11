require('dotenv').config()

module.exports = {
    debug_mode: false,
    port: process.env.NODE_PORT || 3006,
    host: process.env.NODE_HOST || '0.0.0.0',
    mongodb: {
        url: process.env.MONGO_URL || 'mongodb://localhost:27017/identomat',
        auth: (process.env.MONGO_AUTH && process.env.MONGO_AUTH === 'true') || false,
        user: process.env.MONGO_USER || 'identomat',
        password: process.env.MONGO_PASSWORD || 'pass',
    },
    logger: {
        dirPath: process.env.LOGGER_DIR || 'logs',
        file: process.env.LOGGER_FILE || 'info.log'
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    },
}
