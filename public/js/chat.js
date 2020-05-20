const socket = io()

const resultHandler = document.getElementById('chatText')
const inputHandler = document.getElementById('formField')
const geoButtonHandler = document.getElementById('sendGeo')
const msgButtonHandler = document.getElementById('sendMsg')
const inputFieldHandler = document.getElementById('inputField')
const messagesHandler = document.querySelector('#messages')


// TEMPLATES -------------------
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// -----------------------------

inputHandler.addEventListener('submit', (e) => {
    e.preventDefault()
    // disable button
    msgButtonHandler.setAttribute('disabled', 'disabled')
    
    let enteredText = document.getElementById('inputField').value  
    socket.emit('sendMessage', enteredText, (msg) => {
        inputField.value = ''
        // enable button
        setTimeout(() => {
            msgButtonHandler.removeAttribute('disabled')
            inputFieldHandler.focus()
        }, 1000)
        
        console.log(msg)
    })
})

socket.on('locationMessage', ({ url, timeStamp }) => {
    console.log(url)
    const html = Mustache.render(locationTemplate, { 
        location: url,
        locationTimeStamp: timeStamp
    })
    messagesHandler.insertAdjacentHTML('afterbegin', html)
})

socket.on('message', ({ text, timeStamp }) => {
   
    const html = Mustache.render(messageTemplate, {
        message: text,
        timeStamp
    })
    messagesHandler.insertAdjacentHTML('afterbegin', html) 
})

geoButtonHandler.addEventListener('click', (e) => {
    const locationObject = navigator.geolocation
    if (!locationObject){
        alert('Your system is not able to send your location.')
    }
     
    geoButtonHandler.setAttribute('disabled', 'disabled')

    function success (position) {
        const coord = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }

        socket.emit('sendLocation', coord, (msg) => {
        console.log(msg)
        geoButtonHandler.removeAttribute('disabled')
        })
    }

    const coord = locationObject.getCurrentPosition(success);


})
