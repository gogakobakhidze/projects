const createRedisClient = require('./lib/createRedisClient')
const config = require('./config')
const WebSocket = require('ws')

const CHANNEL = 'session_status'

const main = async () => {
    const server = new WebSocket.Server({
        port: config.port
    })

    const redisClient = await createRedisClient(config.redis)
    redisClient.subscribe(CHANNEL)
    console.log('Server started')

    let sockets = {}
    server.on('connection', function(socket) {
        console.log('client registered')

        socket.on('message', function(msg) {
            console.log(`message received from socket ${msg}`)
            try {
                const { sessionId } = JSON.parse(msg)
                console.log(`Adding new listener for id ${sessionId}`)
                if (!sockets[sessionId]) sockets[sessionId] = []
                sockets[sessionId].push(socket)
            } catch (e) {
                console.error(`Invalid message ${msg}`, e)
            }
        })

        socket.on('close', function() {
            for (let session in sockets) {
                sockets[session] = sockets[session].filter(s => s !== socket)
            }
        })
    })

    redisClient.on('message', (channel, message) => {
        console.log(`message  ${message} received from redis on channel ${channel}`)
        if (channel !== CHANNEL) {
            return console.error(`Invalid channel ${channel}`)
        }

        try {
            const { sessionId, result }  = JSON.parse(message)
            console.log(`Session status ${sessionId} changed to ${result}`)
            if (sockets[sessionId]) {
                console.log(`Sending message to sockets with id ${sessionId}`)
                sockets[sessionId].forEach(s => s.send(message))
            }
        } catch (e) {
            console.error(`Invalid message ${message}`, e)
        }
    })
}

main()