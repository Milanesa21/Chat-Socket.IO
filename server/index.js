import express from 'express';
import http from 'http';
import { Server  as SocketServer} from 'socket.io';

const app = express()
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});

let messages = [];
let users = {};

io.on('connection', socket =>{
    console.log(socket.id);

    socket.on('username', (username) => {
        users[socket.id] = username;
        socket.emit('messages', messages);
    })

    socket.on('message', (message) =>{
        console.log(message.body);
        // message.from = users[socket.id] || socket.id.slice(6);
        messages.push(message);
        socket.broadcast.emit('message', message);
    })

    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    })
})

server.listen(3000)
console.log('server on port', 3000);