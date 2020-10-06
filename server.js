const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const { addUser, getUsers, removeUser } = require('./User')
const { REPL_MODE_STRICT } = require('repl')
const moment = require('moment')

const app = express()

const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

io.on("connection", socket => {
    console.log("New Connection was connected!")
    // io.emit('message', "has joined")
    socket.on('joinRoom', ({ username, room }, callback) => {
        const {error} = addUser({id : socket.id, username, room })
        if(error){
            callback(error)
        }
        socket.join(room)
        socket.emit('message', { msg : 'Welcome', username : 'Admin', room,  time : moment().format('h:mm a') })
        socket.broadcast.to(room).emit('message', { msg : `${username} has joined!`, username : 'Admin', room, time : moment().format('h:mm a') })
        io.to(room).emit('roomUsers', {users : getUsers(room), room})
        callback()
    })

    socket.on('chatMessage', (msg) => {
        io.to(msg.room).emit('message', {...msg, time : moment().format('h:mm a')})
    })
    socket.on('disconnect', () => {
        console.log('disconnect is triggering')
        const user = removeUser(socket.id)
        io.to(user.room).emit('message',{msg : `${user.username} has left`, room : user.room, username : 'Admin', time : moment(new Date()).format('h:m a')})
    })
})


const PORT = 3000 || process.env.PORT


server.listen(PORT, () => {
    console.log("App is listening on server 3000")
})
