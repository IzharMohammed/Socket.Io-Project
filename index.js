import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const server = createServer(app);
const io = new Server(server);
// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the 'public' directory



io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('from_client', () => {
        console.log(`event coming from client`);
    })

    socket.on('msg_sent', (data) => {
        console.log('from server', data);
        io.to(data.roomid).emit('msg_rcvd', data);
    })
    socket.on('join_room', (data) => {
        socket.join(data.roomid);
        console.log(`user : ${socket.id} joined room : ${data.roomid}`);

    })

    setInterval(() => {
        // socket.emit('from_server');
    }, 2000);
});



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.get('/chat/:roomid', async (req, res) => {
    res.render('index', {
        name: 'izhar',
        id: req.params.roomid
    })
})
server.listen(3000, () => {
    console.log('Server is up !!!');
});
