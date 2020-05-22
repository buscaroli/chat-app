const generateMessage = (username, text) => {
    const now = new Date().toLocaleTimeString()
    return {
        username,
        text: text.toString(),
        timeStamp: now
    }
}

const generateLocationMsg = (username, url) => {
    const now = new Date().toLocaleTimeString()
    return {
        username,
        url: url.toString(),
        timeStamp: now
    }
}

module.exports = {
    generateMessage,
    generateLocationMsg
}