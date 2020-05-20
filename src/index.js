const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter({ placeHolder: 'x' })
        let filtered_msg = msg
        if (filter.isProfane) {
            filtered_msg = filter.clean(msg)
        }
        io.emit('message', filtered_msg)
        callback('Message delivery: acknowledged.')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the Chat :( ')
    })

    socket.on('sendLocation', (coord, callback) => {
        const { latitude, longitude } = coord
        io.emit('locationMessage', `https://google.com/maps?q=${latitude},${longitude}`)
        callback('Location shared!')
    })

})

server.listen(port, () => {
    console.log(`Server Up and running on port ${port}.`)
})