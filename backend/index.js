const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080", // Replace with your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// Enable CORS
app.use(cors());

// Initialize Supabase client
const supabaseUrl = 'https://lfcvjlhlhbpvzhqodkny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmY3ZqbGhsaGJwdnpocW9ka255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNjExNjQsImV4cCI6MjAzOTczNzE2NH0.u_ptBjMsf_Sj2eN1bS1oopTGczwEww4DJu4jyXoMNjg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle sending messages
  socket.on('send_message', async ({ conversation_id, sender_id, message }) => {
    // Insert the message into the Supabase table
    const { data, error } = await supabase
      .from('tbl_messages')
      .insert([{ conversation_id, sender_id, message }]);

    if (error) {
      console.error('Error inserting message:', error);
      return;
    }

    // Emit the message to all connected clients
    io.emit('receive_message', { conversation_id, sender_id, message, sent_at: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });