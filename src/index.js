const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMsg } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server) // socket.io expects to be called with a raw http server
                            // and cannot be called with app

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))


io.on('connection', (socket) => {
    console.log('New Web Socket connected.')

    socket.emit('message', generateMessage('You have entered the Main Chat.'))
    socket.broadcast.emit('message', generateMessage('A new user has joined the Chat!'))

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter({ placeHolder: 'x' })
        if (filter.isProfane(msg)) {
            msg = filter.clean(msg)
        }

        io.emit('message', generateMessage(msg))
        callback('Message delivery: acknowledged.')
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left the Chat :( '))
    })

    socket.on('sendLocation', (coord, callback) => {
        const { latitude, longitude } = coord
        io.emit('locationMessage', generateLocationMsg(`https://google.com/maps?q=${latitude},${longitude}`))
        callback('Location shared!')
    })

})

server.listen(port, () => {
    console.log(`Server Up and running on port ${port}.`)
})