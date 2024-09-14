import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
const app = express();
const prisma = new PrismaClient();
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

    socket.on('msg_sent', async (data) => {
        console.log('from server', data);
        await prisma.chat.create({
            data: {
                username: data.username,
                message: data.msg,
                roomId: data.roomid
            }
        })
        io.to(data.roomid).emit('msg_rcvd', data);
    })
    socket.on('join_room', (data) => {
        socket.join(data.roomid);
        console.log(`user : ${socket.id} joined room : ${data.roomid}`);

    })

});



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.get('/chat/:roomid', async (req, res) => {
    const chats = await prisma.chat.findMany({
        where: {
            roomId: req.params.roomid
    }})
    console.log(chats);
    
    res.render('index', {
        name: 'izhar',
        id: req.params.roomid,
        chats
    })
})
server.listen(3000, () => {
    console.log('Server is up !!!');
});
