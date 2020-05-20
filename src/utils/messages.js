const generateMessage = (text) => {
    const now = new Date().toLocaleTimeString()
    return {
        text: text.toString(),
        timeStamp: now
    }
}

const generateLocationMsg = (url) => {
    const now = new Date().toLocaleTimeString()
    return {
        url: url.toString(),
        timeStamp: now
    }
}

module.exports = {
    generateMessage,
    generateLocationMsg
}