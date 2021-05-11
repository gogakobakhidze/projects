const createRedisClient = require('./lib/createRedisClient')
const config = require('./config')

const main = async () => {
    const redisClient = await createRedisClient(config.redis)

    redisClient.publish('session_status', JSON.stringify({
        sessionId: '13a379aa8635e935fdaeff9a6625f6111e060d3f'
    }))

    console.log('message sent')
}

main()