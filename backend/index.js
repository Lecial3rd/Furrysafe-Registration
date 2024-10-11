const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const setupSocket = require('./config/socket'); // Import the socket setup function
const supabase = require('./config/supabase');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080', // Replace with specific origins in production
    methods: ['GET', 'POST'],
  },
});

// Enable CORS
app.use(cors());
app.use(express.json());

// Setup socket.io
const messageRoutes = setupSocket(io, supabase); // Pass both io and supabase to the socket setup function

// Use routes
app.use('/auth', authRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);

// Optional: Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});