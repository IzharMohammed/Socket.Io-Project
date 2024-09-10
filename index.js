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
app.use(express.static(path.join(__dirname, '/public')));



io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('from_client', () => {
        console.log(`event coming from client`);
    })

    socket.on('msg_sent', (data) => {
        console.log(data);

    })

    setInterval(() => {
        socket.emit('from_server');
    }, 2000);
});




server.listen(3000, () => {
    console.log('Server is up !!!');
});
