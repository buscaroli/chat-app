const socket = io()

const resultHandler = document.getElementById('chatText')
const inputHandler = document.getElementById('formField')
const geoButtonHandler = document.getElementById('sendGeo')
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

geoButtonHandler.addEventListener('click', (e) => {
    const locationObject = navigator.geolocation
    if (!locationObject){
        alert('Your system is not able to send your location.')
    }
     
    function success (position) {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }

    const coord = locationObject.getCurrentPosition(success);


})
