import express from 'express';  // Import Express framework
import { createServer } from 'http';  // Import HTTP module to create server
import { Server } from 'socket.io';  // Import Socket.io for real-time communication
import path from 'path';  // Import Path module for handling file paths
import { fileURLToPath } from 'url';  // Import fileURLToPath for ES Module support
import { PrismaClient } from '@prisma/client';  // Import PrismaClient for database interactions

const app = express();  // Create an Express application
const prisma = new PrismaClient();  // Create a Prisma client instance
const server = createServer(app);  // Create an HTTP server using the Express app
const io = new Server(server);  // Create a Socket.io server

// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);  // Get the current file path
const __dirname = path.dirname(__filename);  // Get the directory name of the current file

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));  // Serve static files from the 'public' folder

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('user connected', socket.id);  // Log when a user connects

    // Handle 'from_client' event
    socket.on('from_client', () => {
        console.log(`event coming from client`);  // Log event coming from client
    })

    // Handle 'msg_sent' event from clients
    socket.on('msg_sent', async (data) => {
        console.log('from server', data);  // Log data received from client
        await prisma.chat.create({  // Save the message to the database
            data: {
                username: data.username,
                message: data.msg,
                roomId: data.roomid
            }
        })
        io.to(data.roomid).emit('msg_rcvd', data);  // Broadcast the message to the room
    })
    
    // Handle 'join_room' event
    socket.on('join_room', (data) => {
        socket.join(data.roomid);  // Join the specified room
        console.log(`user : ${socket.id} joined room : ${data.roomid}`);  // Log room join
    })
});

// Set view engine to EJS for rendering templates
app.set('view engine', 'ejs');

// Handle route for chat room
app.get('/chat/:roomid', async (req, res) => {
    // Fetch chat messages from the database based on room ID
    const chats = await prisma.chat.findMany({
        where: {
            roomId: req.params.roomid
    }})
    console.log(chats);  // Log fetched chat messages
    
    // Render the 'index' view with room ID and chat messages
    res.render('index', {
        name: 'izhar',
        id: req.params.roomid,
        chats
    })
})

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is up !!!');  // Log server start
});
