const express = require('express');
const router = express.Router();
const setupMessageRoutes = require('../routes/messageRoutes');

const setupSocket = (io, supabase) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle user connection
    socket.on('user_connected', (user) => {
      setupMessageRoutes(io, supabase, socket, user);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
    
  });

  return setupMessageRoutes(io, supabase);
};

module.exports = setupSocket;