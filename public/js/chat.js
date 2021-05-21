const socket= io()


// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

































































































































// // Elements
// const $messageForm = document.querySelector('#message-form')
// const $messageFormInput = $messageForm.querySelector('input')
// const $messageFormButton = $messageForm.querySelector('button')
// const $sendLocationButton = document.querySelector('#send-location')
// const $messages = document.querySelector('#messages')

// // Templates
// const messageTemplate = document.querySelector('#message-template').innerHTML


// const $inputMessage = ('.inputMessage'); 
// const sendMessage = () => {
//     let message = $inputMessage.val();
//     // Prevent markup from being injected into the message
//     message = cleanInput(message);
//     // if there is a non-empty message and a socket connection
//     if (message && connected) {
//       $inputMessage.val('');
//       addChatMessage({ username, message });
//       // tell server to execute 'new message' and send along one parameter
//       socket.emit('new message', message);
//     }
//   }

//   // Log a message
//   const log = (message, options) => {
//     const $el = $('<li>').addClass('log').text(message);
//     addMessageElement($el, options);
//   }



 





// //   const log = (message, options) => {
// //     const $el = $('<li>').addClass('log').text(message);
// //     addMessageElement($el, options);
// //     console.log(message)
// //     $messages.insertAdjacentHTML('beforeend', `<li>${message}</li>`)
// //   }
// // // socket.on('message', (message) => {
// // //     log(message)

// // //     // Log a message

// // //     // const html = Mustache.render(messageTemplate, {
// // //     //     message
// // //     // })
// // //     // $messages.insertAdjacentHTML('beforeend', html)
// // // })


// // socket.on('message',(message) => {
// //     console.log(message)
// // })


// $messageForm.addEventListener('submit', (e) => {
//     e.preventDefault()

//     $messageFormButton.setAttribute('disabled', 'disabled')

//     const message = e.target.elements.message.value

//     socket.emit('sendMessage', message, (error) => {
//         $messageFormButton.removeAttribute('disabled')
//         $messageFormInput.value = ''
//         $messageFormInput.focus()

//         if (error) {
//             return console.log(error)
//         }

//         console.log('Message delivered!')
//     })
// })

// $sendLocationButton.addEventListener('click', () => {
//     if (!navigator.geolocation) {
//         return alert('Geolocation is not supported by your browser.')
//     }

//     $sendLocationButton.setAttribute('disabled', 'disabled')

//     navigator.geolocation.getCurrentPosition((position) => {
//         socket.emit('sendLocation', {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//         }, () => {
//             $sendLocationButton.removeAttribute('disabled')
//             console.log('Location shared!')  
//         })
//     })
// })



// // document.querySelector('#message-form').addEventListener('submit', (e)=>{
// //     e.preventDefault()

// //     const message = e.target.elements.message.value

// //     socket.emit('sendMessage', message, (message)=>{
// //         console.log('The message was delivered!',message)
// //     })

// // })


// // document.querySelector('#send-location').addEventListener('click',()=>{
// //    if(!navigator.geolocation) {
// //        return alert('Geolocation not supported by your browser')
// //    } 

// //    navigator.geolocation.getCurrentPosition((position) => {
    
// //     socket.emit('sendLocation',{
// //         latitude: position.coords.latitude,
// //         longitude: position.coords.longitude

// //     })
// //    })
// // })
    
