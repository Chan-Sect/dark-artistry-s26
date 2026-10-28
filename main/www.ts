#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './app.js'
import debug from 'debug'
import http from 'http'
import URL from '../config/connections/URI/server.js'
import colors from 'colors'

/**
 * Kết nối Database
 */
import connect from '../database/main/connect.js'

debug('server:server')

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string) => isNaN(parseInt(val, 10)) ? val : parseInt(val, 10) >= 0 ? parseInt(val, 10) : false

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || URL.port)
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error: NodeJS.ErrnoException) =>
{
    if (error.syscall !== 'listen') throw error

    const bind = typeof port === 'string' ? `Pipe ${ port }` : `Port ${ port }`

    if (error.code === 'EACCES')
    {
        console.error(`${ bind } requires elevated privileges`)
        process.exit(1)
    }
    else if (error.code === 'EADDRINUSE')
    {
        console.error(`${ bind } is already in use`)
        process.exit(1)
    } else throw error
}
/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () =>
{
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : `port ${ addr?.port }`
    debug('Listening on ' + bind)
}

// const connect = require('../database/main/connect')
// const check = require('../database/main/check')
// const Socket = require('../config/Connection/Socket')

connect().then(async (response) =>
{
    if (response.error) console.log(colors.red(response.message))
    else
    {
        console.log(response.message)
        // await check()
        // Socket.start(server)
    }
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

console.log('Bắt đầu server tại port', colors.bold.cyan(port.toString()))