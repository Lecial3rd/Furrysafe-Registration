const express = require('express');
const { sendMessage } = require('../controllers/messageController');
const router = express.Router();

// Send a message to a conversation (POST)
const setupMessageRoutes = (io, supabase) => {
  router.post('/send', async (req, res) => {
    try {
      const { senderId, conversationId, message, imgPath } = req.body;

      const newMessage = await sendMessage(io, senderId, conversationId, message, imgPath);
      
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  return router;
};

module.exports = setupMessageRoutes;