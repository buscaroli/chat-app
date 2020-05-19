const socket = io()

const resultHandler = document.getElementById('chatText')
const inputHandler = document.getElementById('formField')
let historicalMsgs = ''


inputHandler.addEventListener('submit', (e) => {
    e.preventDefault()
    let enteredText = document.getElementById('inputField').value  
    socket.emit('sendMessage', enteredText)
})

socket.on('message', (msg) => {
    historicalMsgs = historicalMsgs + '<br>' + msg
    resultHandler.innerHTML = historicalMsgs 
})
