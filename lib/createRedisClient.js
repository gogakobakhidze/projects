const redis = require('redis')

module.exports = config => {
    const client = redis.createClient(config.port, config.host)

    return new Promise((resolve, reject) => {
        client.on('ready', () => resolve(client))
        client.on('error', err => reject(err))
    })
}