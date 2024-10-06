const express = require('express');
const { sendMessage } = require('../controllers/messageController');
const router = express.Router();

// Send a message to a conversation
router.post('/send', async (req, res) => {
  const { senderId, conversationId, message, imagePath } = req.body;

  const newMessage = await sendMessage(senderId, conversationId, message, imagePath);
  
  if (!newMessage) {
    return res.status(500).json({ error: 'Failed to send message' });
  }

  res.status(201).json(newMessage);
});

module.exports = router;
