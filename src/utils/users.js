const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
    if(!username || !room) {
        return {
            error: 'Username and Room required.'
        }
    }

    // check for existing username
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    
    // validate username
    if (existingUser) {
        return {
            error: 'Username already in use.'
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)

    return { user }
}

const removeUser = ( id ) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index === -1) {
        return {
            error: 'User not in the room.'
        }
    }
    return users.splice(index, 1)[0]
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}