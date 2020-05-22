const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMsg } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server) // socket.io expects to be called with a raw http server
                            // and cannot be called with app

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))


io.on('connection', (socket) => {
    console.log('New Web Socket connected.')
    
    // ALternative using the Spread operator:
    // socket.on('join', (options, callback) => {
        // const { error, user } = addUser({ id: socket.id , ...options })

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id ,username, room})

        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', `You have joined ${user.room}.`))
        socket.to(user.room).emit('message', generateMessage('Admin', `You have entered ${ user.room }.`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${ user.username } has joined the Room!`))

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })


    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
    
        const filter = new Filter({ placeHolder: 'x' })
        if (filter.isProfane(msg)) {
            msg = filter.clean(msg)
        }
       
        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the Room :( `))

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }  
    })

    socket.on('sendLocation', (coord, callback) => {
        const user = getUser(socket.id)

        const { latitude, longitude } = coord
        io.to(user.room).emit('locationMessage', generateLocationMsg(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
        callback('is sharing location.')
    })

})


server.listen(port, () => {
    console.log(`Server Up and running on port ${port}.`)
})