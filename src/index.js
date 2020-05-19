const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server) // socket.io expects to be called with a raw http server
                            // and cannot be called with app

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))


io.on('connection', (socket) => {
    console.log('New Web Socket connected.')

    socket.broadcast.emit('message', 'A new user has joined the Chat!')

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the Chat :( ')
    })
})

server.listen(port, () => {
    console.log(`Server Up and running on port ${port}.`)
})