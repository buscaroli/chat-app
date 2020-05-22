const socket = io()

const resultHandler = document.getElementById('chatText')
const inputHandler = document.getElementById('formField')
const geoButtonHandler = document.getElementById('sendGeo')
const msgButtonHandler = document.getElementById('sendMsg')
const inputFieldHandler = document.getElementById('inputField')
const messagesHandler = document.querySelector('#messages')
const sidebarHandler = document.querySelector('#sidebar')


// TEMPLATES -------------------
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// OPTIONS ---------------------
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// -----------------------------


inputHandler.addEventListener('submit', (e) => {
    e.preventDefault()
    // disable button
    msgButtonHandler.setAttribute('disabled', 'disabled')
    
    let enteredText = document.getElementById('inputField').value  
    
    socket.emit('sendMessage', enteredText, (error) => {
        inputField.value = ''
        // enable button
        setTimeout(() => {
            msgButtonHandler.removeAttribute('disabled')
            inputFieldHandler.focus()

            if (error) {
                return console.log(error)
            }
            console.log('message delivered')
        }, 1000)
        
    })
})


socket.on('locationMessage', (message) => {
   
    const html = Mustache.render(locationTemplate, { 
        username: message.username,
        location: message.url,
        locationTimeStamp: message.timeStamp
    })
    messagesHandler.insertAdjacentHTML('afterbegin', html)
})

socket.on('message', (message) => {

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        timeStamp: message.timeStamp
    })
    messagesHandler.insertAdjacentHTML('afterbegin', html) 
})


socket.on('roomUsers', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebarHandler.innerHTML = html
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
        
        geoButtonHandler.removeAttribute('disabled')
        })
    }

    const coord = locationObject.getCurrentPosition(success);


})

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})